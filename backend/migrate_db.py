import os
import sqlite3

def run_raw_migration():
    db_path = os.path.join(os.path.dirname(__file__), 'instance', 'inventory.db')
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("PRAGMA table_info(users);")
        cols = [row[1] for row in cursor.fetchall()]

        if 'role' not in cols:
            cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'NOC Operator';")
            print("Added 'role' column to users table.")

        if 'status' not in cols:
            cursor.execute("ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'Active';")
            print("Added 'status' column to users table.")

        conn.commit()
        conn.close()

if __name__ == '__main__':
    run_raw_migration()
    
    from app import create_app
    from database import db
    from seed import seed_database

    app = create_app()
    with app.app_context():
        seed_database()
        print("Migration and Team Seeding completed successfully!")
