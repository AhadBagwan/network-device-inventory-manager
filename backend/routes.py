import re
import ipaddress
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db
from models import User, Device, Activity
from services.ping_service import execute_ping
from services.csv_service import generate_inventory_csv

api = Blueprint('api', __name__)

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
# At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()-])[A-Za-z\d@$!%*?&_#^()-]{8,}$')
MAC_REGEX = re.compile(r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$')

def log_activity(action: str, hostname: str, details: str):
    """Helper to log NOC activities."""
    activity = Activity(
        action=action,
        device_hostname=hostname,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.session.add(activity)

# ==========================================
# PUBLIC & INDEX ROUTES
# ==========================================

@api.route('/', methods=['GET'])
def api_index():
    return jsonify({
        'name': 'NetPulse NOC Telemetry Manager API',
        'status': 'Online',
        'version': '2.0.0',
        'auth_stack': 'Flask-JWT-Extended',
        'endpoints': {
            'register': 'POST /api/register',
            'login': 'POST /api/login',
            'profile': 'GET /api/profile (Protected)',
            'logout': 'POST /api/logout (Protected)',
            'devices': 'GET/POST /api/devices (Protected)',
            'statistics': 'GET /api/statistics (Protected)',
            'activities': 'GET /api/activities (Protected)',
            'export_csv': 'GET /api/devices/export (Protected)'
        }
    }), 200

# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@api.route('/register', methods=['POST'])
def register():
    """Registers a new NOC administrator user."""
    data = request.get_json() or {}
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    errors = {}

    if not full_name:
        errors['full_name'] = 'Full name is required.'
    
    if not email:
        errors['email'] = 'Email address is required.'
    elif not EMAIL_REGEX.match(email):
        errors['email'] = 'Enter a valid email address.'
    else:
        if User.query.filter_by(email=email).first():
            errors['email'] = 'An account with this email address already exists.'

    if not password:
        errors['password'] = 'Password is required.'
    elif len(password) < 8:
        errors['password'] = 'Password must be at least 8 characters long.'
    elif not PASSWORD_REGEX.match(password):
        errors['password'] = 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'

    if errors:
        return jsonify({'errors': errors}), 400

    user = User(
        full_name=full_name,
        email=email
    )
    user.set_password(password)

    db.session.add(user)
    log_activity('Register', email, f'Registered new administrator account for {full_name}.')
    db.session.commit()

    return jsonify({
        'message': 'Account created successfully. Please log in.',
        'user': user.to_dict()
    }), 201

@api.route('/login', methods=['POST'])
def login():
    """Authenticates user and returns JWT access token."""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email address or password.'}), 401

    # Create JWT access token
    access_token = create_access_token(identity=str(user.id))
    log_activity('Login', user.email, f'User {user.full_name} logged into NOC dashboard.')
    db.session.commit()

    return jsonify({
        'message': 'Authentication successful.',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    """Returns profile of currently authenticated user."""
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({'message': 'User not found.'}), 404
    return jsonify(user.to_dict()), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logs out user session."""
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    email = user.email if user else 'User'
    log_activity('Logout', email, 'User logged out of NOC portal.')
    db.session.commit()
    return jsonify({'message': 'Logged out successfully.'}), 200

# ==========================================
# PROTECTED DEVICE & INVENTORY ROUTES
# ==========================================

def validate_device_payload(data, is_update=False, current_id=None):
    errors = {}
    
    hostname = data.get('hostname', '').strip()
    ip_address = data.get('ip_address', '').strip()
    device_type = data.get('device_type', '').strip()
    vendor = data.get('vendor', '').strip()
    model = data.get('model', '').strip()
    location = data.get('location', '').strip()
    mac_address = data.get('mac_address', '').strip()
    status = data.get('status', 'Unknown').strip()

    if not hostname:
        errors['hostname'] = 'Hostname is required.'
    else:
        query = Device.query.filter(Device.hostname.ilike(hostname))
        if is_update and current_id:
            query = query.filter(Device.id != current_id)
        if query.first():
            errors['hostname'] = f'Device with hostname "{hostname}" already exists.'

    if not ip_address:
        errors['ip_address'] = 'IPv4 address is required.'
    else:
        try:
            ipaddress.IPv4Address(ip_address)
            query = Device.query.filter(Device.ip_address == ip_address)
            if is_update and current_id:
                query = query.filter(Device.id != current_id)
            if query.first():
                errors['ip_address'] = f'Device with IP address "{ip_address}" already exists.'
        except ValueError:
            errors['ip_address'] = 'Invalid IPv4 address format (e.g. 192.168.1.1).'

    if not device_type:
        errors['device_type'] = 'Device type is required.'

    if not vendor:
        errors['vendor'] = 'Vendor is required.'

    if not model:
        errors['model'] = 'Model is required.'

    if not location:
        errors['location'] = 'Location is required.'

    if mac_address and not MAC_REGEX.match(mac_address):
        errors['mac_address'] = 'Invalid MAC format (e.g. 00:1A:2B:3C:4D:5E or 001A.2B3C.4D5E).'

    return errors

@api.route('/devices', methods=['GET'])
@jwt_required()
def get_devices():
    search_query = request.args.get('search', '').strip()
    vendor_filter = request.args.get('vendor', '').strip()
    status_filter = request.args.get('status', '').strip()
    type_filter = request.args.get('type', '').strip()
    location_filter = request.args.get('location', '').strip()
    sort_by = request.args.get('sort_by', 'hostname').strip()
    sort_order = request.args.get('sort_order', 'asc').strip()

    query = Device.query

    if search_query:
        search_pattern = f"%{search_query}%"
        query = query.filter(
            (Device.hostname.ilike(search_pattern)) |
            (Device.ip_address.ilike(search_pattern)) |
            (Device.vendor.ilike(search_pattern)) |
            (Device.location.ilike(search_pattern)) |
            (Device.model.ilike(search_pattern)) |
            (Device.operating_system.ilike(search_pattern))
        )

    if vendor_filter:
        query = query.filter(Device.vendor == vendor_filter)
    if status_filter:
        query = query.filter(Device.status == status_filter)
    if type_filter:
        query = query.filter(Device.device_type == type_filter)
    if location_filter:
        query = query.filter(Device.location == location_filter)

    sort_attr = getattr(Device, sort_by, None)
    if sort_attr is None:
        sort_attr = Device.hostname

    if sort_order.lower() == 'desc':
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())

    devices = query.all()
    return jsonify([d.to_dict() for d in devices]), 200

@api.route('/devices/<int:device_id>', methods=['GET'])
@jwt_required()
def get_device(device_id):
    device = Device.query.get_or_404(device_id)
    return jsonify(device.to_dict()), 200

@api.route('/devices', methods=['POST'])
@jwt_required()
def add_device():
    data = request.get_json() or {}
    errors = validate_device_payload(data)
    if errors:
        return jsonify({'errors': errors}), 400

    device = Device(
        hostname=data['hostname'].strip(),
        ip_address=data['ip_address'].strip(),
        device_type=data['device_type'].strip(),
        vendor=data['vendor'].strip(),
        model=data['model'].strip(),
        operating_system=data.get('operating_system', '').strip(),
        serial_number=data.get('serial_number', '').strip(),
        mac_address=data.get('mac_address', '').strip().upper(),
        location=data['location'].strip(),
        rack=data.get('rack', '').strip(),
        status=data.get('status', 'Unknown').strip(),
        notes=data.get('notes', '').strip()
    )

    db.session.add(device)
    log_activity("Added Device", device.hostname, f"Added new {device.vendor} {device.device_type} ({device.ip_address}) in {device.location}.")
    db.session.commit()

    return jsonify(device.to_dict()), 201

@api.route('/devices/<int:device_id>', methods=['PUT'])
@jwt_required()
def update_device(device_id):
    device = Device.query.get_or_404(device_id)
    data = request.get_json() or {}

    errors = validate_device_payload(data, is_update=True, current_id=device_id)
    if errors:
        return jsonify({'errors': errors}), 400

    old_status = device.status
    new_status = data.get('status', device.status).strip()

    device.hostname = data['hostname'].strip()
    device.ip_address = data['ip_address'].strip()
    device.device_type = data['device_type'].strip()
    device.vendor = data['vendor'].strip()
    device.model = data['model'].strip()
    device.operating_system = data.get('operating_system', '').strip()
    device.serial_number = data.get('serial_number', '').strip()
    device.mac_address = data.get('mac_address', '').strip().upper()
    device.location = data['location'].strip()
    device.rack = data.get('rack', '').strip()
    device.status = new_status
    device.notes = data.get('notes', '').strip()

    if old_status != new_status:
        log_activity("Edited Device", device.hostname, f"Status updated from {old_status} to {new_status}.")
    else:
        log_activity("Edited Device", device.hostname, f"Updated configurations for {device.hostname}.")

    db.session.commit()
    return jsonify(device.to_dict()), 200

@api.route('/devices/<int:device_id>', methods=['DELETE'])
@jwt_required()
def delete_device(device_id):
    device = Device.query.get_or_404(device_id)
    hostname = device.hostname
    ip = device.ip_address

    db.session.delete(device)
    log_activity("Deleted Device", hostname, f"Removed device {hostname} ({ip}) from inventory database.")
    db.session.commit()

    return jsonify({'message': f'Device {hostname} successfully deleted.'}), 200

@api.route('/devices/ping/<int:device_id>', methods=['POST'])
@jwt_required()
def ping_single_device(device_id):
    device = Device.query.get_or_404(device_id)
    
    old_status = device.status
    status, latency = execute_ping(device.ip_address, current_status=device.status)

    device.status = status
    device.latency = latency
    device.last_checked = datetime.utcnow()

    details = f"Pinged {device.hostname} ({device.ip_address}) -> Status: {status}"
    if latency:
        details += f", Latency: {latency:.2f}ms"

    if old_status != status and old_status not in ['Unknown', 'Maintenance']:
        log_activity("Status Changed", device.hostname, f"Status changed from {old_status} to {status}.")
    else:
        log_activity("Ping Executed", device.hostname, details)

    db.session.commit()
    return jsonify(device.to_dict()), 200

@api.route('/devices/ping-all', methods=['POST'])
@jwt_required()
def ping_all_devices():
    devices = Device.query.all()
    results = []

    online_count = 0
    offline_count = 0
    maintenance_count = 0

    for device in devices:
        status, latency = execute_ping(device.ip_address, current_status=device.status)
        device.status = status
        device.latency = latency
        device.last_checked = datetime.utcnow()

        if status == 'Online':
            online_count += 1
        elif status == 'Maintenance':
            maintenance_count += 1
        else:
            offline_count += 1

        results.append(device.to_dict())

    log_activity("Bulk Ping", "ALL_DEVICES", f"Executed network-wide bulk ping. {online_count} Online, {offline_count} Offline, {maintenance_count} Maintenance.")
    db.session.commit()

    return jsonify({
        'message': f'Bulk ping complete: {online_count} Online, {offline_count} Offline, {maintenance_count} Maintenance.',
        'devices': results
    }), 200

@api.route('/devices/export', methods=['GET'])
@jwt_required()
def export_devices():
    devices = Device.query.order_by(Device.hostname.asc()).all()
    log_activity("Export Inventory", "NOC_ADMIN", f"Exported {len(devices)} device records to CSV file.")
    db.session.commit()
    return generate_inventory_csv(devices)

@api.route('/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
    devices = Device.query.all()
    total = len(devices)
    online = sum(1 for d in devices if d.status == 'Online')
    offline = sum(1 for d in devices if d.status == 'Offline')
    maintenance = sum(1 for d in devices if d.status == 'Maintenance')
    unknown = sum(1 for d in devices if d.status == 'Unknown')

    routers = sum(1 for d in devices if d.device_type == 'Router')
    switches = sum(1 for d in devices if d.device_type == 'Switch')
    firewalls = sum(1 for d in devices if d.device_type == 'Firewall')
    servers = sum(1 for d in devices if d.device_type == 'Server')

    latencies = [d.latency for d in devices if d.latency is not None and d.status == 'Online']
    avg_latency = round(sum(latencies) / len(latencies), 2) if latencies else 0.0

    # Availability excludes maintenance devices from outage penalties!
    active_pool = total - maintenance
    online_percentage = round((online / active_pool * 100), 1) if active_pool > 0 else 100.0

    # Health Score calculation (0 - 100)
    health_score = int(round(online_percentage * 0.8 + (100 - min(avg_latency, 50)) * 0.2))

    vendor_counts = {}
    for d in devices:
        vendor_counts[d.vendor] = vendor_counts.get(d.vendor, 0) + 1
    vendor_breakdown = [{'vendor': k, 'count': v} for k, v in vendor_counts.items()]

    type_counts = {}
    for d in devices:
        type_counts[d.device_type] = type_counts.get(d.device_type, 0) + 1
    type_breakdown = [{'device_type': k, 'count': v} for k, v in type_counts.items()]

    locations = sorted(list({d.location for d in devices if d.location}))

    return jsonify({
        'total_devices': total,
        'online_devices': online,
        'offline_devices': offline,
        'maintenance_devices': maintenance,
        'unknown_devices': unknown,
        'routers': routers,
        'switches': switches,
        'firewalls': firewalls,
        'servers': servers,
        'avg_latency': avg_latency,
        'online_percentage': online_percentage,
        'health_score': max(0, min(100, health_score)),
        'vendor_breakdown': vendor_breakdown,
        'type_breakdown': type_breakdown,
        'locations': locations
    }), 200

@api.route('/activities', methods=['GET'])
@jwt_required()
def get_activities():
    activities = Activity.query.order_by(Activity.timestamp.desc()).limit(20).all()
    return jsonify([a.to_dict() for a in activities]), 200

@api.route('/activities/clear', methods=['POST'])
@jwt_required()
def clear_activities():
    Activity.query.delete()
    log_activity("Clear Log", "NOC_ADMIN", "Cleared all activity audit trail entries.")
    db.session.commit()
    return jsonify({'message': 'Activity timeline cleared successfully.'}), 200

@api.route('/reset-inventory', methods=['POST'])
@jwt_required()
def reset_inventory():
    from seed import SEED_DEVICES
    Device.query.delete()
    Activity.query.delete()
    
    for data in SEED_DEVICES:
        device = Device(**data)
        db.session.add(device)

    log_activity("Reset Inventory", "NOC_ADMIN", "Restored default 15 enterprise network devices.")
    db.session.commit()

    return jsonify({'message': 'Inventory successfully reset to default 15 enterprise assets.'}), 200
