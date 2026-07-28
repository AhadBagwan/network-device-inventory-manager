import re
import ipaddress
from datetime import datetime
from flask import Blueprint, request, jsonify
from database import db
from models import Device, Activity
from services.ping_service import execute_ping
from services.csv_service import generate_inventory_csv

api = Blueprint('api', __name__)

@api.route('/', methods=['GET'])
def api_index():
    """Root API index endpoint showing API status and available routes."""
    return jsonify({
        'name': 'Network Device Inventory Manager API',
        'status': 'Online',
        'version': '1.0.0',
        'endpoints': {
            'devices': '/api/devices',
            'statistics': '/api/statistics',
            'activities': '/api/activities',
            'export_csv': '/api/devices/export',
            'ping_single': 'POST /api/devices/ping/<id>',
            'ping_all': 'POST /api/devices/ping-all',
            'reset_inventory': 'POST /api/reset-inventory',
            'clear_activities': 'POST /api/activities/clear'
        }
    }), 200

# Accepts standard colon (00:1A:2B:3C:4D:5E), hyphen (00-1A-2B-3C-4D-5E), or Cisco dot (001a.2b3c.4d5e)
MAC_REGEX = re.compile(
    r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$'
)

def log_activity(action: str, hostname: str, details: str):
    """Helper to log NOC activities."""
    activity = Activity(
        action=action,
        device_hostname=hostname,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.session.add(activity)

def validate_device_payload(data, is_update=False, current_id=None):
    """Validates device input data thoroughly."""
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
        # Check duplicate hostname
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
            # Check duplicate IP
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
        errors['mac_address'] = 'Invalid MAC address format (e.g. 00:1A:2B:3C:4D:5E or 001A.2B3C.4D5E).'

    return errors

@api.route('/devices', methods=['GET'])
def get_devices():
    """List network devices with optional search, filtering, and sorting."""
    search_query = request.args.get('search', '').strip()
    vendor_filter = request.args.get('vendor', '').strip()
    status_filter = request.args.get('status', '').strip()
    type_filter = request.args.get('type', '').strip()
    location_filter = request.args.get('location', '').strip()
    sort_by = request.args.get('sort_by', 'hostname').strip()
    sort_order = request.args.get('sort_order', 'asc').strip()

    query = Device.query

    # Apply search filter across Hostname, IP, Vendor, Location, Model, OS
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

    # Apply dropdown filters
    if vendor_filter:
        query = query.filter(Device.vendor == vendor_filter)
    if status_filter:
        query = query.filter(Device.status == status_filter)
    if type_filter:
        query = query.filter(Device.device_type == type_filter)
    if location_filter:
        query = query.filter(Device.location == location_filter)

    # Safe sorting attribute lookup
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
def get_device(device_id):
    """Get single device details."""
    device = Device.query.get_or_404(device_id)
    return jsonify(device.to_dict()), 200

@api.route('/devices', methods=['POST'])
def add_device():
    """Create a new network device asset."""
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
        status='Unknown',
        notes=data.get('notes', '').strip()
    )

    db.session.add(device)
    log_activity("Added Device", device.hostname, f"Added new {device.vendor} {device.device_type} ({device.ip_address}) in {device.location}.")
    db.session.commit()

    return jsonify(device.to_dict()), 201

@api.route('/devices/<int:device_id>', methods=['PUT'])
def update_device(device_id):
    """Update existing network device asset."""
    device = Device.query.get_or_404(device_id)
    data = request.get_json() or {}

    errors = validate_device_payload(data, is_update=True, current_id=device_id)
    if errors:
        return jsonify({'errors': errors}), 400

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
    device.notes = data.get('notes', '').strip()

    log_activity("Edited Device", device.hostname, f"Updated configurations and details for {device.hostname}.")
    db.session.commit()

    return jsonify(device.to_dict()), 200

@api.route('/devices/<int:device_id>', methods=['DELETE'])
def delete_device(device_id):
    """Delete a network device."""
    device = Device.query.get_or_404(device_id)
    hostname = device.hostname
    ip = device.ip_address

    db.session.delete(device)
    log_activity("Deleted Device", hostname, f"Removed device {hostname} ({ip}) from inventory database.")
    db.session.commit()

    return jsonify({'message': f'Device {hostname} successfully deleted.'}), 200

@api.route('/devices/ping/<int:device_id>', methods=['POST'])
def ping_single_device(device_id):
    """Execute ping on a single device."""
    device = Device.query.get_or_404(device_id)
    
    old_status = device.status
    status, latency = execute_ping(device.ip_address)

    device.status = status
    device.latency = latency
    device.last_checked = datetime.utcnow()

    details = f"Pinged {device.hostname} ({device.ip_address}) -> Status: {status}"
    if latency:
        details += f", Latency: {latency:.2f}ms"

    if old_status != status and old_status != 'Unknown':
        log_activity("Status Changed", device.hostname, f"Status changed from {old_status} to {status}.")
    else:
        log_activity("Ping Executed", device.hostname, details)

    db.session.commit()
    return jsonify(device.to_dict()), 200

@api.route('/devices/ping-all', methods=['POST'])
def ping_all_devices():
    """Bulk ping all stored network devices."""
    devices = Device.query.all()
    results = []

    online_count = 0
    offline_count = 0

    for device in devices:
        status, latency = execute_ping(device.ip_address)
        device.status = status
        device.latency = latency
        device.last_checked = datetime.utcnow()

        if status == 'Online':
            online_count += 1
        else:
            offline_count += 1

        results.append(device.to_dict())

    log_activity("Bulk Ping", "ALL_DEVICES", f"Executed network-wide bulk ping scan. {online_count} Online, {offline_count} Offline.")
    db.session.commit()

    return jsonify({
        'message': f'Bulk ping complete: {online_count} Online, {offline_count} Offline.',
        'devices': results
    }), 200

@api.route('/devices/export', methods=['GET'])
def export_devices():
    """Export device inventory into CSV format."""
    devices = Device.query.order_by(Device.hostname.asc()).all()
    log_activity("Export Inventory", "NOC_ADMIN", f"Exported {len(devices)} device records to CSV file.")
    db.session.commit()
    return generate_inventory_csv(devices)

@api.route('/statistics', methods=['GET'])
def get_statistics():
    """Aggregates dashboard statistics and metrics."""
    devices = Device.query.all()
    total = len(devices)
    online = sum(1 for d in devices if d.status == 'Online')
    offline = sum(1 for d in devices if d.status == 'Offline')
    unknown = sum(1 for d in devices if d.status == 'Unknown')

    routers = sum(1 for d in devices if d.device_type == 'Router')
    switches = sum(1 for d in devices if d.device_type == 'Switch')
    firewalls = sum(1 for d in devices if d.device_type == 'Firewall')
    servers = sum(1 for d in devices if d.device_type == 'Server')

    latencies = [d.latency for d in devices if d.latency is not None and d.status == 'Online']
    avg_latency = round(sum(latencies) / len(latencies), 2) if latencies else 0.0

    online_percentage = round((online / total * 100), 1) if total > 0 else 0.0

    # Vendor breakdown
    vendor_counts = {}
    for d in devices:
        vendor_counts[d.vendor] = vendor_counts.get(d.vendor, 0) + 1
    vendor_breakdown = [{'vendor': k, 'count': v} for k, v in vendor_counts.items()]

    # Device type breakdown
    type_counts = {}
    for d in devices:
        type_counts[d.device_type] = type_counts.get(d.device_type, 0) + 1
    type_breakdown = [{'device_type': k, 'count': v} for k, v in type_counts.items()]

    # Locations list
    locations = sorted(list({d.location for d in devices if d.location}))

    return jsonify({
        'total_devices': total,
        'online_devices': online,
        'offline_devices': offline,
        'unknown_devices': unknown,
        'routers': routers,
        'switches': switches,
        'firewalls': firewalls,
        'servers': servers,
        'avg_latency': avg_latency,
        'online_percentage': online_percentage,
        'vendor_breakdown': vendor_breakdown,
        'type_breakdown': type_breakdown,
        'locations': locations
    }), 200

@api.route('/activities', methods=['GET'])
def get_activities():
    """Get recent activity logs."""
    activities = Activity.query.order_by(Activity.timestamp.desc()).limit(20).all()
    return jsonify([a.to_dict() for a in activities]), 200

@api.route('/activities/clear', methods=['POST'])
def clear_activities():
    """Clear activity log timeline."""
    Activity.query.delete()
    log_activity("Clear Log", "NOC_ADMIN", "Cleared all activity audit trail entries.")
    db.session.commit()
    return jsonify({'message': 'Activity timeline cleared successfully.'}), 200

@api.route('/reset-inventory', methods=['POST'])
def reset_inventory():
    """Resets inventory and re-seeds default enterprise devices."""
    from seed import SEED_DEVICES
    Device.query.delete()
    Activity.query.delete()
    
    for data in SEED_DEVICES:
        device = Device(**data)
        db.session.add(device)

    log_activity("Reset Inventory", "NOC_ADMIN", "Restored default 15 enterprise network devices.")
    db.session.commit()

    return jsonify({'message': 'Inventory successfully reset to default 15 enterprise assets.'}), 200

