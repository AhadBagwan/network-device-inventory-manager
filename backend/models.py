from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from database import db

def get_utc_now():
    return datetime.now(timezone.utc)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=get_utc_now)

    def set_password(self, password: str):
        """Generates secure password hash using Werkzeug."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verifies password against stored hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PasswordResetOTP(db.Model):
    __tablename__ = 'password_reset_otps'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, index=True)
    otp_code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=get_utc_now)

    def is_valid(self):
        return not self.used and datetime.now(timezone.utc) < self.expires_at.replace(tzinfo=timezone.utc) if self.expires_at.tzinfo is None else datetime.now(timezone.utc) < self.expires_at

class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    hostname = db.Column(db.String(100), unique=True, nullable=False)
    ip_address = db.Column(db.String(45), unique=True, nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    vendor = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    operating_system = db.Column(db.String(100), nullable=True)
    firmware_version = db.Column(db.String(50), nullable=True)
    serial_number = db.Column(db.String(100), nullable=True)
    mac_address = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=False)
    rack = db.Column(db.String(50), nullable=True)
    warranty_expiry = db.Column(db.String(50), nullable=True)
    tags = db.Column(db.String(255), nullable=True)
    device_group = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default='Unknown')  # Online, Offline, Maintenance, Unknown
    latency = db.Column(db.Float, nullable=True)          # in milliseconds
    last_checked = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=get_utc_now)
    updated_at = db.Column(db.DateTime, default=get_utc_now, onupdate=get_utc_now)

    # Relationship to ping history RTT logs
    ping_history = db.relationship('PingHistory', backref='device', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_history=False):
        """Serializes device model. Passes include_history=True to avoid N+1 query overhead in list views."""
        tag_list = [t.strip() for t in self.tags.split(',') if t.strip()] if self.tags else []

        recent_pings = []
        if include_history:
            recent_pings = [p.to_dict() for p in self.ping_history.order_by(PingHistory.timestamp.desc()).limit(10).all()]
            recent_pings.reverse()

        return {
            'id': self.id,
            'hostname': self.hostname,
            'ip_address': self.ip_address,
            'device_type': self.device_type,
            'vendor': self.vendor,
            'model': self.model,
            'operating_system': self.operating_system or '',
            'firmware_version': self.firmware_version or '',
            'serial_number': self.serial_number or '',
            'mac_address': self.mac_address or '',
            'location': self.location,
            'rack': self.rack or '',
            'warranty_expiry': self.warranty_expiry or '',
            'tags': tag_list,
            'device_group': self.device_group or 'Default Zone',
            'status': self.status,
            'latency': round(self.latency, 2) if self.latency is not None else None,
            'last_checked': self.last_checked.isoformat() if self.last_checked else None,
            'notes': self.notes or '',
            'recent_pings': recent_pings,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PingHistory(db.Model):
    __tablename__ = 'ping_history'

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False, index=True)
    latency = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, default=get_utc_now, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'latency': round(self.latency, 2) if self.latency is not None else None,
            'status': self.status,
            'timestamp': self.timestamp.isoformat()
        }

class Activity(db.Model):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)
    device_hostname = db.Column(db.String(100), nullable=True)
    details = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=get_utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'device_hostname': self.device_hostname,
            'details': self.details,
            'timestamp': self.timestamp.isoformat()
        }

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    severity = db.Column(db.String(20), default='info')  # info, warning, critical
    read = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=get_utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'severity': self.severity,
            'read': self.read,
            'timestamp': self.timestamp.isoformat()
        }
