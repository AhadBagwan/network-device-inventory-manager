from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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

class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    hostname = db.Column(db.String(100), unique=True, nullable=False)
    ip_address = db.Column(db.String(45), unique=True, nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    vendor = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    operating_system = db.Column(db.String(100), nullable=True)
    serial_number = db.Column(db.String(100), nullable=True)
    mac_address = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=False)
    rack = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='Unknown')  # Online, Offline, Maintenance, Unknown
    latency = db.Column(db.Float, nullable=True)          # in milliseconds
    last_checked = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'hostname': self.hostname,
            'ip_address': self.ip_address,
            'device_type': self.device_type,
            'vendor': self.vendor,
            'model': self.model,
            'operating_system': self.operating_system or '',
            'serial_number': self.serial_number or '',
            'mac_address': self.mac_address or '',
            'location': self.location,
            'rack': self.rack or '',
            'status': self.status,
            'latency': round(self.latency, 2) if self.latency is not None else None,
            'last_checked': self.last_checked.isoformat() if self.last_checked else None,
            'notes': self.notes or '',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Activity(db.Model):
    __tablename__ = 'activities'

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)     # e.g., Login, Logout, Added Device, Maintenance
    device_hostname = db.Column(db.String(100), nullable=True)
    details = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'device_hostname': self.device_hostname,
            'details': self.details,
            'timestamp': self.timestamp.isoformat()
        }
