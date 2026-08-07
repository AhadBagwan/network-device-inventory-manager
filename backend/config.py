import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'noc-inventory-secret-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'netpulse-jwt-secret-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    db_url = os.environ.get('DATABASE_URL')
    if db_url and db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)

    SQLALCHEMY_DATABASE_URI = db_url or f"sqlite:///{os.path.join(BASE_DIR, 'inventory.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
