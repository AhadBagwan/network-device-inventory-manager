from datetime import datetime, timedelta, timezone
from database import db
from models import User, Device, Activity, PingHistory, Notification

now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

SEED_DEVICES = [
    {
        "hostname": "HQ-RTR-01",
        "ip_address": "192.168.1.1",
        "device_type": "Router",
        "vendor": "Cisco",
        "model": "ISR4331/K9",
        "operating_system": "Cisco IOS-XE",
        "firmware_version": "17.03.04a",
        "serial_number": "FOC2418L09A",
        "mac_address": "00:1A:2B:3C:4D:5E",
        "location": "Headquarters",
        "rack": "Rack-A01 (U42)",
        "warranty_expiry": "2028-12-31",
        "tags": "Core, Critical, WAN",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 2.45,
        "last_checked": now_utc - timedelta(minutes=5),
        "notes": "Primary Core Edge Router for HQ WAN connectivity."
    },
    {
        "hostname": "DC-SW-01",
        "ip_address": "192.168.1.10",
        "device_type": "Switch",
        "vendor": "Cisco",
        "model": "Catalyst 9300-48U",
        "operating_system": "Cisco IOS-XE",
        "firmware_version": "17.06.01r",
        "serial_number": "FCW2341M02B",
        "mac_address": "00:1A:2B:88:99:AA",
        "location": "Data Center",
        "rack": "Rack-DC01 (U12)",
        "warranty_expiry": "2027-06-30",
        "tags": "Core, 10G, Datacenter",
        "device_group": "Datacenter Core",
        "status": "Online",
        "latency": 1.12,
        "last_checked": now_utc - timedelta(minutes=3),
        "notes": "Core 10G distribution switch for server cluster."
    },
    {
        "hostname": "FW-HQ-01",
        "ip_address": "192.168.1.254",
        "device_type": "Firewall",
        "vendor": "Fortinet",
        "model": "FortiGate 100F",
        "operating_system": "FortiOS",
        "firmware_version": "v7.2.4-build1396",
        "serial_number": "FG100FTK21008912",
        "mac_address": "70:4C:A5:11:22:33",
        "location": "Headquarters",
        "rack": "Rack-A01 (U40)",
        "warranty_expiry": "2026-11-15",
        "tags": "Perimeter, Security, VPN",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 3.80,
        "last_checked": now_utc - timedelta(minutes=2),
        "notes": "Perimeter firewall with active IPS & SSL VPN."
    },
    {
        "hostname": "SRV-APP-01",
        "ip_address": "192.168.1.50",
        "device_type": "Server",
        "vendor": "Dell",
        "model": "PowerEdge R750",
        "operating_system": "Ubuntu Server 22.04 LTS",
        "firmware_version": "iDRAC9 v6.10",
        "serial_number": "8HG9KL3",
        "mac_address": "E4:11:5B:44:55:66",
        "location": "Server Room",
        "rack": "Rack-SR02 (U18)",
        "warranty_expiry": "2029-03-31",
        "tags": "Production, Application, Linux",
        "device_group": "Server Compute",
        "status": "Online",
        "latency": 0.85,
        "last_checked": now_utc - timedelta(minutes=10),
        "notes": "Primary Production ERP & Application Host."
    },
    {
        "hostname": "BR-RTR-02",
        "ip_address": "10.10.20.1",
        "device_type": "Router",
        "vendor": "Juniper",
        "model": "MX240",
        "operating_system": "Junos OS",
        "firmware_version": "21.4R1-S2",
        "serial_number": "JN1290833AA",
        "mac_address": "00:05:85:AA:BB:CC",
        "location": "Branch Office East",
        "rack": "Rack-BR01 (U10)",
        "warranty_expiry": "2027-09-30",
        "tags": "BGP, MPLS, Branch",
        "device_group": "Branch Perimeter",
        "status": "Online",
        "latency": 14.30,
        "last_checked": now_utc - timedelta(minutes=8),
        "notes": "BGP Edge Router connecting East Branch MPLS."
    },
    {
        "hostname": "DC-LB-01",
        "ip_address": "192.168.1.100",
        "device_type": "Load Balancer",
        "vendor": "F5 Networks",
        "model": "BIG-IP i2800",
        "operating_system": "TMOS",
        "firmware_version": "16.1.2.2",
        "serial_number": "F5-9081-1122",
        "mac_address": "00:01:D7:66:77:88",
        "location": "Data Center",
        "rack": "Rack-DC02 (U20)",
        "warranty_expiry": "2028-05-15",
        "tags": "LoadBalancer, SSL, DMZ",
        "device_group": "Datacenter Core",
        "status": "Online",
        "latency": 2.10,
        "last_checked": now_utc - timedelta(minutes=4),
        "notes": "SSL offloading and web farm traffic balancing."
    },
    {
        "hostname": "WLC-HQ-01",
        "ip_address": "192.168.1.15",
        "device_type": "Wireless Controller",
        "vendor": "Cisco",
        "model": "Catalyst 9800-L",
        "operating_system": "Cisco IOS-XE",
        "firmware_version": "17.03.05",
        "serial_number": "FCW2430N01C",
        "mac_address": "00:1A:2B:DD:EE:FF",
        "location": "Headquarters",
        "rack": "Rack-A02 (U04)",
        "warranty_expiry": "2027-11-30",
        "tags": "Wireless, Mobility",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 1.95,
        "last_checked": now_utc - timedelta(minutes=1),
        "notes": "Manages 45 corporate Wi-Fi Access Points."
    },
    {
        "hostname": "AP-HQ-FL1",
        "ip_address": "192.168.1.80",
        "device_type": "Access Point",
        "vendor": "Aruba",
        "model": "AP-535",
        "operating_system": "ArubaOS",
        "firmware_version": "8.10.0.4",
        "serial_number": "CNG8K9901A",
        "mac_address": "D8:C7:C8:12:34:56",
        "location": "Headquarters - Floor 1",
        "rack": "Ceiling Mount F1",
        "warranty_expiry": "2026-08-31",
        "tags": "Wi-Fi6, AccessPoint",
        "device_group": "Wireless Access",
        "status": "Online",
        "latency": 4.15,
        "last_checked": now_utc - timedelta(minutes=12),
        "notes": "Wi-Fi 6 AP serving Executive and Visitor zones."
    },
    {
        "hostname": "FW-DMZ-01",
        "ip_address": "192.168.2.1",
        "device_type": "Firewall",
        "vendor": "Palo Alto",
        "model": "PA-3220",
        "operating_system": "PAN-OS",
        "firmware_version": "10.1.6-h3",
        "serial_number": "012801009988",
        "mac_address": "00:1B:17:99:88:77",
        "location": "Data Center",
        "rack": "Rack-DC01 (U08)",
        "warranty_expiry": "2028-10-31",
        "tags": "DMZ, ThreatPrevention",
        "device_group": "Datacenter Core",
        "status": "Online",
        "latency": 1.88,
        "last_checked": now_utc - timedelta(minutes=6),
        "notes": "DMZ Isolation and Next-Gen Threat Prevention."
    },
    {
        "hostname": "DC-SW-02",
        "ip_address": "192.168.1.11",
        "device_type": "Switch",
        "vendor": "Dell",
        "model": "PowerSwitch S5248F-ON",
        "operating_system": "Dell SmartFabric OS10",
        "firmware_version": "10.5.4.2",
        "serial_number": "DL99182C01",
        "mac_address": "E4:11:5B:99:00:11",
        "location": "Data Center",
        "rack": "Rack-DC02 (U14)",
        "warranty_expiry": "2027-04-30",
        "tags": "Datacenter, Maintenance",
        "device_group": "Datacenter Core",
        "status": "Maintenance",
        "latency": None,
        "last_checked": now_utc - timedelta(minutes=7),
        "notes": "Scheduled firmware upgrade window (Q3 Maintenance Window)."
    },
    {
        "hostname": "SRV-DB-01",
        "ip_address": "192.168.1.55",
        "device_type": "Server",
        "vendor": "HP",
        "model": "ProLiant DL380 Gen10",
        "operating_system": "Red Hat Enterprise Linux 9",
        "firmware_version": "iLO 5 v2.72",
        "serial_number": "CZJ210887X",
        "mac_address": "3C:A8:2A:44:33:22",
        "location": "Server Room",
        "rack": "Rack-SR01 (U22)",
        "warranty_expiry": "2029-01-31",
        "tags": "Database, Critical, PostgreSQL",
        "device_group": "Server Compute",
        "status": "Online",
        "latency": 0.92,
        "last_checked": now_utc - timedelta(minutes=4),
        "notes": "Primary PostgreSQL Enterprise Database Cluster Host."
    },
    {
        "hostname": "BR-SW-01",
        "ip_address": "10.10.20.10",
        "device_type": "Switch",
        "vendor": "MikroTik",
        "model": "CRS354-48P-4S+2Q+RM",
        "operating_system": "RouterOS",
        "firmware_version": "v7.8.1",
        "serial_number": "MT889100234",
        "mac_address": "64:D1:54:33:22:11",
        "location": "Branch Office East",
        "rack": "Rack-BR01 (U06)",
        "warranty_expiry": "2025-12-31",
        "tags": "PoE, Access, Branch",
        "device_group": "Branch Perimeter",
        "status": "Offline",
        "latency": None,
        "last_checked": now_utc - timedelta(hours=1),
        "notes": "Access switch for East Branch desktops - Power supply failure."
    },
    {
        "hostname": "AP-BR-01",
        "ip_address": "10.10.20.80",
        "device_type": "Access Point",
        "vendor": "Ubiquiti",
        "model": "UniFi 6 Pro",
        "operating_system": "UniFi OS",
        "firmware_version": "v3.1.16",
        "serial_number": "U6-PRO-9812",
        "mac_address": "74:83:C2:55:66:77",
        "location": "Branch Office East",
        "rack": "Wall Mount B1",
        "warranty_expiry": "2026-10-31",
        "tags": "Branch, Wi-Fi",
        "device_group": "Wireless Access",
        "status": "Online",
        "latency": 12.80,
        "last_checked": now_utc - timedelta(minutes=15),
        "notes": "Branch wireless access point."
    },
    {
        "hostname": "HYP-VS-01",
        "ip_address": "192.168.1.60",
        "device_type": "Server",
        "vendor": "VMware",
        "model": "ESXi 8.0 Hypervisor Host",
        "operating_system": "VMware ESXi",
        "firmware_version": "8.0u1b-build21813344",
        "serial_number": "VMW-HOST-8821",
        "mac_address": "00:50:56:11:22:33",
        "location": "Data Center",
        "rack": "Rack-DC03 (U30)",
        "warranty_expiry": "2029-06-30",
        "tags": "Hypervisor, Virtualization",
        "device_group": "Server Compute",
        "status": "Online",
        "latency": 0.78,
        "last_checked": now_utc - timedelta(minutes=2),
        "notes": "Hosts 24 virtual machines including Domain Controller."
    },
    {
        "hostname": "HQ-RTR-02",
        "ip_address": "192.168.1.2",
        "device_type": "Router",
        "vendor": "Cisco",
        "model": "ISR4321/K9",
        "operating_system": "Cisco IOS-XE",
        "firmware_version": "17.03.04a",
        "serial_number": "FOC2418L09B",
        "mac_address": "00:1A:2B:3C:4D:5F",
        "location": "Headquarters",
        "rack": "Rack-A01 (U44)",
        "warranty_expiry": "2028-12-31",
        "tags": "Backup, WAN",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 2.60,
        "last_checked": now_utc - timedelta(minutes=5),
        "notes": "Backup Failover WAN Gateway Router."
    }
]

def seed_database():
    """Populates database with initial admin user, 15 devices, and initial alert notifications."""
    if User.query.count() == 0:
        print("Seeding initial default admin user...")
        admin = User(
            full_name="Admin User",
            email="admin@netpulse.noc"
        )
        admin.set_password("Admin@123")
        db.session.add(admin)
        db.session.commit()
        print("Default admin created: admin@netpulse.noc / Admin@123")

    if Device.query.count() == 0:
        print("Seeding initial 15 network devices into inventory database...")
        for data in SEED_DEVICES:
            device = Device(**data)
            db.session.add(device)
        
        # Add initial notifications
        n1 = Notification(
            title="Scheduled Maintenance Window",
            message="Device DC-SW-02 entered Q3 Maintenance Mode.",
            severity="warning",
            timestamp=now_utc - timedelta(minutes=30)
        )
        n2 = Notification(
            title="Power Supply Alert",
            message="Device BR-SW-01 reported offline due to power outage.",
            severity="critical",
            timestamp=now_utc - timedelta(hours=1)
        )
        n3 = Notification(
            title="Telemetry Scan Complete",
            message="Automated ICMP probing finished with 92.9% SLA availability.",
            severity="info",
            timestamp=now_utc - timedelta(minutes=5)
        )
        db.session.add_all([n1, n2, n3])

        seed_activity = Activity(
            action="System Seed",
            device_hostname="SYSTEM",
            details="Seeded 15 enterprise network devices with tags, groups, and ping history tracking."
        )
        db.session.add(seed_activity)
        db.session.commit()
        print("Database seeding completed successfully.")

if __name__ == '__main__':
    from app import app
    with app.app_context():
        seed_database()
