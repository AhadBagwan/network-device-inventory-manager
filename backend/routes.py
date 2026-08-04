import re
import io
import pandas as pd
import ipaddress
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db
from models import User, Device, PingHistory, Activity, Notification
from services.ping_service import execute_ping
from services.csv_service import generate_inventory_csv

api = Blueprint('api', __name__)

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
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

def create_notification(title: str, message: str, severity: str = 'info'):
    """Helper to create NOC system alert notifications."""
    notif = Notification(
        title=title,
        message=message,
        severity=severity,
        timestamp=datetime.utcnow()
    )
    db.session.add(notif)

# ==========================================
# PUBLIC & INDEX ROUTES
# ==========================================

@api.route('/', methods=['GET'])
def api_index():
    return jsonify({
        'name': 'NetPulse NOC Telemetry Manager API',
        'status': 'Online',
        'version': '2.3.0',
        'auth_stack': 'Flask-JWT-Extended',
        'endpoints': {
            'register': 'POST /api/register',
            'login': 'POST /api/login',
            'profile': 'GET /api/profile (Protected)',
            'logout': 'POST /api/logout (Protected)',
            'devices': 'GET/POST /api/devices (Protected)',
            'import_csv': 'POST /api/devices/import (Protected)',
            'bulk_delete': 'POST /api/devices/bulk-delete (Protected)',
            'bulk_status': 'POST /api/devices/bulk-status (Protected)',
            'statistics': 'GET /api/statistics (Protected)',
            'activities': 'GET /api/activities (Protected)',
            'notifications': 'GET /api/notifications (Protected)',
            'export_csv': 'GET /api/devices/export (Protected)'
        }
    }), 200

# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

@api.route('/register', methods=['POST'])
def register():
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
        errors['password'] = 'Password must include uppercase, lowercase, number, and special character.'

    if errors:
        return jsonify({'errors': errors}), 400

    user = User(full_name=full_name, email=email)
    user.set_password(password)

    db.session.add(user)
    log_activity('Register', email, f'Registered administrator account for {full_name}.')
    create_notification('New Operator Registered', f'Operator {full_name} ({email}) joined NOC team.', 'info')
    db.session.commit()

    return jsonify({
        'message': 'Account created successfully. Please log in.',
        'user': user.to_dict()
    }), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email address or password.'}), 401

    access_token = create_access_token(identity=str(user.id))
    log_activity('Login', user.email, f'User {user.full_name} authenticated.')
    db.session.commit()

    return jsonify({
        'message': 'Authentication successful.',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({'message': 'User not found.'}), 404
    return jsonify(user.to_dict()), 200

@api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    email = user.email if user else 'User'
    log_activity('Logout', email, 'User logged out.')
    db.session.commit()
    return jsonify({'message': 'Logged out successfully.'}), 200

# ==========================================
# DEVICE INVENTORY & TELEMETRY ROUTES
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
            errors['ip_address'] = 'Invalid IPv4 address format.'

    if not device_type:
        errors['device_type'] = 'Device type is required.'
    if not vendor:
        errors['vendor'] = 'Vendor is required.'
    if not model:
        errors['model'] = 'Model is required.'
    if not location:
        errors['location'] = 'Location is required.'

    if mac_address and not MAC_REGEX.match(mac_address):
        errors['mac_address'] = 'Invalid MAC format (e.g. 00:1A:2B:3C:4D:5E).'

    return errors

@api.route('/devices', methods=['GET'])
@jwt_required()
def get_devices():
    search_query = request.args.get('search', '').strip()
    vendor_filter = request.args.get('vendor', '').strip()
    status_filter = request.args.get('status', '').strip()
    type_filter = request.args.get('type', '').strip()
    location_filter = request.args.get('location', '').strip()
    tag_filter = request.args.get('tag', '').strip()
    group_filter = request.args.get('group', '').strip()
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
            (Device.operating_system.ilike(search_pattern)) |
            (Device.tags.ilike(search_pattern)) |
            (Device.device_group.ilike(search_pattern))
        )

    if vendor_filter:
        query = query.filter(Device.vendor == vendor_filter)
    if status_filter:
        query = query.filter(Device.status == status_filter)
    if type_filter:
        query = query.filter(Device.device_type == type_filter)
    if location_filter:
        query = query.filter(Device.location == location_filter)
    if tag_filter:
        query = query.filter(Device.tags.ilike(f"%{tag_filter}%"))
    if group_filter:
        query = query.filter(Device.device_group == group_filter)

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

    tags_val = data.get('tags', '')
    if isinstance(tags_val, list):
        tags_val = ', '.join(tags_val)

    device = Device(
        hostname=data['hostname'].strip(),
        ip_address=data['ip_address'].strip(),
        device_type=data['device_type'].strip(),
        vendor=data['vendor'].strip(),
        model=data['model'].strip(),
        operating_system=data.get('operating_system', '').strip(),
        firmware_version=data.get('firmware_version', '').strip(),
        serial_number=data.get('serial_number', '').strip(),
        mac_address=data.get('mac_address', '').strip().upper(),
        location=data['location'].strip(),
        rack=data.get('rack', '').strip(),
        warranty_expiry=data.get('warranty_expiry', '').strip(),
        tags=tags_val.strip(),
        device_group=data.get('device_group', 'Default Zone').strip(),
        status=data.get('status', 'Unknown').strip(),
        notes=data.get('notes', '').strip()
    )

    db.session.add(device)
    log_activity("Added Device", device.hostname, f"Added new {device.vendor} {device.device_type} ({device.ip_address}).")
    create_notification('Asset Added', f'Added device {device.hostname} ({device.ip_address}).', 'info')
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

    tags_val = data.get('tags', '')
    if isinstance(tags_val, list):
        tags_val = ', '.join(tags_val)

    device.hostname = data['hostname'].strip()
    device.ip_address = data['ip_address'].strip()
    device.device_type = data['device_type'].strip()
    device.vendor = data['vendor'].strip()
    device.model = data['model'].strip()
    device.operating_system = data.get('operating_system', '').strip()
    device.firmware_version = data.get('firmware_version', '').strip()
    device.serial_number = data.get('serial_number', '').strip()
    device.mac_address = data.get('mac_address', '').strip().upper()
    device.location = data['location'].strip()
    device.rack = data.get('rack', '').strip()
    device.warranty_expiry = data.get('warranty_expiry', '').strip()
    device.tags = tags_val.strip()
    device.device_group = data.get('device_group', device.device_group).strip()
    device.status = new_status
    device.notes = data.get('notes', '').strip()

    if old_status != new_status:
        log_activity("Edited Device", device.hostname, f"Status updated from {old_status} to {new_status}.")
        if new_status == 'Maintenance':
            create_notification('Maintenance Window Started', f'Device {device.hostname} entered Maintenance Mode.', 'warning')
        elif new_status == 'Offline':
            create_notification('Device Offline Alert', f'Device {device.hostname} ({device.ip_address}) reported Offline.', 'critical')
    else:
        log_activity("Edited Device", device.hostname, f"Updated hardware specs for {device.hostname}.")

    db.session.commit()
    return jsonify(device.to_dict()), 200

@api.route('/devices/<int:device_id>', methods=['DELETE'])
@jwt_required()
def delete_device(device_id):
    device = Device.query.get_or_404(device_id)
    hostname = device.hostname
    ip = device.ip_address

    db.session.delete(device)
    log_activity("Deleted Device", hostname, f"Removed asset {hostname} ({ip}) from inventory.")
    create_notification('Asset Removed', f'Removed {hostname} ({ip}) from NOC inventory.', 'warning')
    db.session.commit()

    return jsonify({'message': f'Device {hostname} successfully deleted.'}), 200

# ==========================================
# BULK ACTIONS & CSV IMPORT ROUTES
# ==========================================

@api.route('/devices/import', methods=['POST'])
@jwt_required()
def import_devices_csv():
    if 'file' not in request.files:
        return jsonify({'message': 'No CSV file attached.'}), 400

    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'message': 'Invalid file format. Please upload a .csv file.'}), 400

    try:
        df = pd.read_csv(io.StringIO(file.stream.read().decode('utf-8-sig')))
    except Exception as e:
        return jsonify({'message': f'Failed to parse CSV file: {str(e)}'}), 400

    # Normalize column names
    df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]

    imported_count = 0
    skipped_count = 0
    errors = []

    for index, row in df.iterrows():
        hostname = str(row.get('hostname', '')).strip()
        ip_address = str(row.get('ip_address', '')).strip()
        device_type = str(row.get('device_type', 'Router')).strip() or 'Router'
        vendor = str(row.get('vendor', 'Other')).strip() or 'Other'
        model = str(row.get('model', 'Generic Model')).strip() or 'Generic Model'
        location = str(row.get('location', 'Headquarters')).strip() or 'Headquarters'

        if not hostname or not ip_address:
            skipped_count += 1
            errors.append(f"Row {index+2}: Hostname and IP address required.")
            continue

        # Check duplicate IPv4 or Hostname
        if Device.query.filter((Device.hostname.ilike(hostname)) | (Device.ip_address == ip_address)).first():
            skipped_count += 1
            errors.append(f"Row {index+2}: Hostname '{hostname}' or IP '{ip_address}' already exists.")
            continue

        device = Device(
            hostname=hostname,
            ip_address=ip_address,
            device_type=device_type,
            vendor=vendor,
            model=model,
            operating_system=str(row.get('operating_system', '')).strip() if pd.notna(row.get('operating_system')) else '',
            firmware_version=str(row.get('firmware_version', '')).strip() if pd.notna(row.get('firmware_version')) else '',
            serial_number=str(row.get('serial_number', '')).strip() if pd.notna(row.get('serial_number')) else '',
            mac_address=str(row.get('mac_address', '')).strip().upper() if pd.notna(row.get('mac_address')) else '',
            location=location,
            rack=str(row.get('rack', '')).strip() if pd.notna(row.get('rack')) else '',
            warranty_expiry=str(row.get('warranty_expiry', '')).strip() if pd.notna(row.get('warranty_expiry')) else '',
            tags=str(row.get('tags', '')).strip() if pd.notna(row.get('tags')) else '',
            device_group=str(row.get('device_group', 'Default Zone')).strip() if pd.notna(row.get('device_group')) else 'Default Zone',
            status=str(row.get('status', 'Unknown')).strip() if pd.notna(row.get('status')) else 'Unknown',
            notes=str(row.get('notes', '')).strip() if pd.notna(row.get('notes')) else ''
        )

        db.session.add(device)
        imported_count += 1

    if imported_count > 0:
        log_activity("CSV Import", "NOC_ADMIN", f"Imported {imported_count} devices from CSV. {skipped_count} skipped.")
        create_notification('Batch CSV Import', f'Batch imported {imported_count} new network devices.', 'info')
        db.session.commit()

    return jsonify({
        'message': f'CSV import completed: {imported_count} imported, {skipped_count} skipped.',
        'imported_count': imported_count,
        'skipped_count': skipped_count,
        'errors': errors
    }), 200

@api.route('/devices/bulk-delete', methods=['POST'])
@jwt_required()
def bulk_delete_devices():
    data = request.get_json() or {}
    device_ids = data.get('device_ids', [])

    if not device_ids or not isinstance(device_ids, list):
        return jsonify({'message': 'Select at least one device to delete.'}), 400

    devices = Device.query.filter(Device.id.in_(device_ids)).all()
    count = len(devices)

    for d in devices:
        db.session.delete(d)

    log_activity("Bulk Delete", "NOC_ADMIN", f"Bulk deleted {count} devices from inventory.")
    create_notification('Bulk Delete Alert', f'Bulk removed {count} devices from NOC inventory.', 'warning')
    db.session.commit()

    return jsonify({'message': f'Successfully deleted {count} selected devices.'}), 200

@api.route('/devices/bulk-status', methods=['POST'])
@jwt_required()
def bulk_update_status():
    data = request.get_json() or {}
    device_ids = data.get('device_ids', [])
    new_status = data.get('status', '').strip()

    if not device_ids or not isinstance(device_ids, list):
        return jsonify({'message': 'Select at least one device.'}), 400

    if new_status not in ['Online', 'Offline', 'Maintenance', 'Unknown']:
        return jsonify({'message': 'Invalid status option.'}), 400

    devices = Device.query.filter(Device.id.in_(device_ids)).all()
    count = len(devices)

    for d in devices:
        d.status = new_status

    log_activity("Bulk Status Change", "NOC_ADMIN", f"Bulk updated status of {count} devices to {new_status}.")
    create_notification('Bulk Status Update', f'Updated {count} devices to {new_status} status.', 'info')
    db.session.commit()

    return jsonify({'message': f'Successfully updated status of {count} devices to {new_status}.'}), 200

# ==========================================
# PROBING & TELEMETRY ROUTES
# ==========================================

@api.route('/devices/ping/<int:device_id>', methods=['POST'])
@jwt_required()
def ping_single_device(device_id):
    device = Device.query.get_or_404(device_id)
    
    old_status = device.status
    status, latency = execute_ping(device.ip_address, current_status=device.status)

    device.status = status
    device.latency = latency
    device.last_checked = datetime.utcnow()

    ping_log = PingHistory(
        device_id=device.id,
        latency=latency,
        status=status,
        timestamp=datetime.utcnow()
    )
    db.session.add(ping_log)

    details = f"Pinged {device.hostname} ({device.ip_address}) -> {status}"
    if latency:
        details += f" ({latency:.2f}ms)"

    if old_status != status and old_status not in ['Unknown', 'Maintenance']:
        log_activity("Status Changed", device.hostname, f"Status changed from {old_status} to {status}.")
        if status == 'Offline':
            create_notification('Host Unreachable Alert', f'{device.hostname} ({device.ip_address}) failed ICMP probe.', 'critical')
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

        ping_log = PingHistory(
            device_id=device.id,
            latency=latency,
            status=status,
            timestamp=datetime.utcnow()
        )
        db.session.add(ping_log)

        if status == 'Online':
            online_count += 1
        elif status == 'Maintenance':
            maintenance_count += 1
        else:
            offline_count += 1

        results.append(device.to_dict())

    log_activity("Bulk Ping", "ALL_DEVICES", f"Scanned all assets: {online_count} Online, {offline_count} Offline, {maintenance_count} Maintenance.")
    create_notification('Network Bulk Ping Scan', f'Bulk scan finished: {online_count} Online, {offline_count} Offline, {maintenance_count} Maintenance.', 'info')
    db.session.commit()

    return jsonify({
        'message': f'Bulk scan complete: {online_count} Online, {offline_count} Offline, {maintenance_count} Maintenance.',
        'devices': results
    }), 200

@api.route('/devices/export', methods=['GET'])
@jwt_required()
def export_devices():
    devices = Device.query.order_by(Device.hostname.asc()).all()
    log_activity("Export Inventory", "NOC_ADMIN", f"Exported {len(devices)} device records to CSV.")
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

    active_pool = total - maintenance
    online_percentage = round((online / active_pool * 100), 1) if active_pool > 0 else 100.0
    health_score = int(round(online_percentage * 0.8 + (100 - min(avg_latency, 50)) * 0.2))

    vendor_counts = {}
    for d in devices:
        vendor_counts[d.vendor] = vendor_counts.get(d.vendor, 0) + 1
    vendor_breakdown = [{'vendor': k, 'count': v} for k, v in vendor_counts.items()]

    type_counts = {}
    for d in devices:
        type_counts[d.device_type] = type_counts.get(d.device_type, 0) + 1
    type_breakdown = [{'device_type': k, 'count': v} for k, v in type_counts.items()]

    all_tags = set()
    for d in devices:
        if d.tags:
            for t in d.tags.split(','):
                if t.strip():
                    all_tags.add(t.strip())

    all_groups = sorted(list({d.device_group for d in devices if d.device_group}))
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
        'locations': locations,
        'tags': sorted(list(all_tags)),
        'groups': all_groups
    }), 200

@api.route('/activities', methods=['GET'])
@jwt_required()
def get_activities():
    activities = Activity.query.order_by(Activity.timestamp.desc()).limit(20).all()
    return jsonify([a.to_dict() for a in activities]), 200

@api.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    notifications = Notification.query.order_by(Notification.timestamp.desc()).limit(15).all()
    return jsonify([n.to_dict() for n in notifications]), 200

@api.route('/notifications/clear', methods=['POST'])
@jwt_required()
def clear_notifications():
    Notification.query.delete()
    db.session.commit()
    return jsonify({'message': 'Notifications cleared.'}), 200

@api.route('/activities/clear', methods=['POST'])
@jwt_required()
def clear_activities():
    Activity.query.delete()
    log_activity("Clear Log", "NOC_ADMIN", "Cleared all activity audit log entries.")
    db.session.commit()
    return jsonify({'message': 'Activity timeline cleared.'}), 200

@api.route('/reset-inventory', methods=['POST'])
@jwt_required()
def reset_inventory():
    from seed import SEED_DEVICES
    Device.query.delete()
    Activity.query.delete()
    PingHistory.query.delete()
    Notification.query.delete()
    
    for data in SEED_DEVICES:
        device = Device(**data)
        db.session.add(device)

    log_activity("Reset Inventory", "NOC_ADMIN", "Restored default 15 enterprise network devices.")
    create_notification('System Reset', 'Restored default NOC inventory assets.', 'info')
    db.session.commit()

    return jsonify({'message': 'Inventory successfully reset to default 15 enterprise assets.'}), 200
