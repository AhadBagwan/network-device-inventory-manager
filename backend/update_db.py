import sqlite3
import glob

for dbfile in glob.glob('**/*.db', recursive=True):
    print('Updating SQLite DB file:', dbfile)
    conn = sqlite3.connect(dbfile)
    cursor = conn.cursor()
    cursor.execute('PRAGMA table_info(users);')
    cols = [r[1] for r in cursor.fetchall()]
    if 'role' not in cols:
        cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'NOC Operator';")
        print('Added role column to', dbfile)
    if 'status' not in cols:
        cursor.execute("ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'Active';")
        print('Added status column to', dbfile)
    conn.commit()
    conn.close()

print('All SQLite DBs updated successfully!')
