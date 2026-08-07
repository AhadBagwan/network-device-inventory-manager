from datetime import datetime, timedelta, timezone
from database import db
from models import User, Device, Activity, PingHistory, Notification

now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

SEED_USERS = [
    {
        "full_name": "Admin User",
        "email": "admin@netpulse.noc",
        "role": "Super Admin",
        "status": "Active"
    },
    {
        "full_name": "John Doe",
        "email": "john.doe@netpulse.noc",
        "role": "Network Engineer",
        "status": "Active"
    },
    {
        "full_name": "Sarah Connor",
        "email": "sarah.connor@netpulse.noc",
        "role": "NOC Operations Lead",
        "status": "Active"
    },
    {
        "full_name": "Alex Mercer",
        "email": "alex.mercer@netpulse.noc",
        "role": "Cyber Security Specialist",
        "status": "Active"
    },
    {
        "full_name": "Ahad Bagwan",
        "email": "bagwanahad@gmail.com",
        "role": "Senior Infrastructure Architect",
        "status": "Active"
    }
]

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
        "hostname": "HQ-SW-CORE-01",
        "ip_address": "192.168.1.2",
        "device_type": "Switch",
        "vendor": "Arista",
        "model": "7050SX3-48YC8",
        "operating_system": "EOS 4.26.1F",
        "firmware_version": "4.26.1F",
        "serial_number": "JPE19380122",
        "mac_address": "00:1C:73:90:11:22",
        "location": "Headquarters",
        "rack": "Rack-A01 (U40)",
        "warranty_expiry": "2027-06-30",
        "tags": "Core, L3, Backbone",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 1.12,
        "last_checked": now_utc - timedelta(minutes=4),
        "notes": "High-density 10G/100G Core Layer 3 Switch."
    },
    {
        "hostname": "HQ-FW-PA01",
        "ip_address": "192.168.1.254",
        "device_type": "Firewall",
        "vendor": "Palo Alto",
        "model": "PA-3220",
        "operating_system": "PAN-OS 10.1.6",
        "firmware_version": "10.1.6-h3",
        "serial_number": "012809003411",
        "mac_address": "00:90:0B:44:55:66",
        "location": "Headquarters",
        "rack": "Rack-A01 (U38)",
        "warranty_expiry": "2026-11-15",
        "tags": "Security, Edge, Perimeter",
        "device_group": "Security Infrastructure",
        "status": "Online",
        "latency": 3.80,
        "last_checked": now_utc - timedelta(minutes=3),
        "notes": "Next-Gen Firewall inspecting inbound/outbound enterprise traffic."
    },
    {
        "hostname": "DC-SRV-ESXI01",
        "ip_address": "10.0.10.15",
        "device_type": "Server",
        "vendor": "Dell",
        "model": "PowerEdge R750",
        "operating_system": "VMware ESXi 7.0U3",
        "firmware_version": "7.0.3-20036589",
        "serial_number": "9X8Y7Z2",
        "mac_address": "B8:59:9F:12:34:56",
        "location": "Data Center A",
        "rack": "Rack-DC01 (U10)",
        "warranty_expiry": "2029-01-31",
        "tags": "Hypervisor, Compute, Production",
        "device_group": "Data Center Compute",
        "status": "Online",
        "latency": 0.85,
        "last_checked": now_utc - timedelta(minutes=2),
        "notes": "Primary VMware Virtualization Host node running core production workloads."
    },
    {
        "hostname": "DC-SW-02",
        "ip_address": "10.0.10.2",
        "device_type": "Switch",
        "vendor": "Cisco",
        "model": "Nexus 93180YC-FX",
        "operating_system": "NX-OS 9.3(8)",
        "firmware_version": "9.3.8",
        "serial_number": "SAL21408899",
        "mac_address": "00:2A:6A:77:88:99",
        "location": "Data Center A",
        "rack": "Rack-DC01 (U08)",
        "warranty_expiry": "2027-09-30",
        "tags": "Top-of-Rack, SAN, Fiber",
        "device_group": "Data Center Compute",
        "status": "Maintenance",
        "latency": 0.00,
        "last_checked": now_utc - timedelta(minutes=15),
        "notes": "Top-of-Rack switch undergoing scheduled SFP+ transceiver replacement."
    },
    {
        "hostname": "BR-RTR-01",
        "ip_address": "172.16.10.1",
        "device_type": "Router",
        "vendor": "Juniper",
        "model": "SRX345",
        "operating_system": "Junos OS 21.4R1",
        "firmware_version": "21.4R1.12",
        "serial_number": "CW3819AF0012",
        "mac_address": "54:E0:32:AA:BB:CC",
        "location": "Branch Office East",
        "rack": "Rack-B01 (U20)",
        "warranty_expiry": "2026-05-31",
        "tags": "Branch, IPsec, Gateway",
        "device_group": "Branch Network",
        "status": "Online",
        "latency": 18.40,
        "last_checked": now_utc - timedelta(minutes=6),
        "notes": "Branch WAN gateway establishing IPsec VPN tunnel back to HQ."
    },
    {
        "hostname": "BR-AP-01",
        "ip_address": "172.16.10.50",
        "device_type": "Access Point",
        "vendor": "Cisco Meraki",
        "model": "MR46-HW",
        "operating_system": "Meraki Cloud OS",
        "firmware_version": "28.6",
        "serial_number": "Q234-ABCD-5678",
        "mac_address": "E8:04:62:33:44:55",
        "location": "Branch Office East",
        "rack": "Ceiling Mount Hall A",
        "warranty_expiry": "2028-03-31",
        "tags": "Wireless, Wi-Fi 6, User Access",
        "device_group": "Branch Network",
        "status": "Online",
        "latency": 4.12,
        "last_checked": now_utc - timedelta(minutes=8),
        "notes": "Wi-Fi 6 Access Point providing coverage for Branch Office East floor."
    },
    {
        "hostname": "HQ-STORAGE-NAS01",
        "ip_address": "192.168.1.100",
        "device_type": "Server",
        "vendor": "Synology",
        "model": "RackStation RS3621xs+",
        "operating_system": "DSM 7.1.1",
        "firmware_version": "7.1.1-42962",
        "serial_number": "2180R3S901234",
        "mac_address": "00:11:32:AA:BB:CC",
        "location": "Headquarters",
        "rack": "Rack-A02 (U12)",
        "warranty_expiry": "2027-12-31",
        "tags": "Storage, Backup, NFS",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 0.95,
        "last_checked": now_utc - timedelta(minutes=1),
        "notes": "Centralized Network Attached Storage for automated system backups."
    },
    {
        "hostname": "BR-SW-01",
        "ip_address": "172.16.10.2",
        "device_type": "Switch",
        "vendor": "Aruba",
        "model": "CX 6300M 48G",
        "operating_system": "ArubaOS-CX",
        "firmware_version": "10.08.1030",
        "serial_number": "SG12930411",
        "mac_address": "00:0B:86:11:22:33",
        "location": "Branch Office East",
        "rack": "Rack-B01 (U18)",
        "warranty_expiry": "2027-04-30",
        "tags": "Access, PoE+, VoIP",
        "device_group": "Branch Network",
        "status": "Offline",
        "latency": 0.00,
        "last_checked": now_utc - timedelta(hours=1),
        "notes": "PoE access switch feeding desktop IP phones; currently unreachable."
    },
    {
        "hostname": "CLOUD-GW-AWS01",
        "ip_address": "52.95.110.1",
        "device_type": "Router",
        "vendor": "Fortinet",
        "model": "FortiGate-VM64",
        "operating_system": "FortiOS 7.2.1",
        "firmware_version": "7.2.1-build1254",
        "serial_number": "FGVM08TM210098",
        "mac_address": "02:A1:B2:C3:D4:E5",
        "location": "AWS us-east-1",
        "rack": "VPC Gateway Slot",
        "warranty_expiry": "2030-01-01",
        "tags": "Cloud, Transit Gateway, Multi-Cloud",
        "device_group": "Cloud Infrastructure",
        "status": "Online",
        "latency": 24.80,
        "last_checked": now_utc - timedelta(minutes=2),
        "notes": "Virtual FortiGate Firewall routing hybrid cloud traffic to AWS VPC."
    },
    {
        "hostname": "DC-FW-PA02",
        "ip_address": "10.0.10.254",
        "device_type": "Firewall",
        "vendor": "Palo Alto",
        "model": "PA-5250",
        "operating_system": "PAN-OS 10.2.2",
        "firmware_version": "10.2.2-h1",
        "serial_number": "013209009988",
        "mac_address": "00:90:0B:77:88:99",
        "location": "Data Center A",
        "rack": "Rack-DC01 (U40)",
        "warranty_expiry": "2029-08-31",
        "tags": "Security, Core, HA-Pair",
        "device_group": "Security Infrastructure",
        "status": "Online",
        "latency": 1.45,
        "last_checked": now_utc - timedelta(minutes=7),
        "notes": "HA Active Palo Alto Next-Gen Firewall serving Data Center Tier."
    },
    {
        "hostname": "HQ-AP-02",
        "ip_address": "192.168.1.80",
        "device_type": "Access Point",
        "vendor": "Ubiquiti",
        "model": "UniFi U6 Enterprise",
        "operating_system": "UniFi OS 3.1",
        "firmware_version": "6.5.62",
        "serial_number": "7483C2109876",
        "mac_address": "74:83:C2:AA:BB:CC",
        "location": "Headquarters",
        "rack": "Ceiling Mount Executive Suite",
        "warranty_expiry": "2027-01-31",
        "tags": "Wireless, Wi-Fi 6E, 6GHz",
        "device_group": "HQ Infrastructure",
        "status": "Online",
        "latency": 2.10,
        "last_checked": now_utc - timedelta(minutes=4),
        "notes": "High-performance Tri-Band Wi-Fi 6E Access Point for Executive Suite."
    },
    {
        "hostname": "SEC-SIEM-LOG01",
        "ip_address": "10.0.20.50",
        "device_type": "Server",
        "vendor": "Cisco",
        "model": "UCS C220 M5",
        "operating_system": "Ubuntu 22.04 LTS",
        "firmware_version": "4.1(3d)",
        "serial_number": "FCH2319V012",
        "mac_address": "00:25:B5:11:22:33",
        "location": "Data Center A",
        "rack": "Rack-DC02 (U14)",
        "warranty_expiry": "2028-05-31",
        "tags": "SIEM, Security Logs, Elastic",
        "device_group": "Security Infrastructure",
        "status": "Online",
        "latency": 0.72,
        "last_checked": now_utc - timedelta(minutes=3),
        "notes": "Dedicated SIEM log aggregator running Elasticsearch and Suricata IDS."
    },
    {
        "hostname": "CLOUD-GW-AZURE01",
        "ip_address": "20.42.10.15",
        "device_type": "Router",
        "vendor": "Cisco",
        "model": "CSR1000v",
        "operating_system": "Cisco IOS-XE Cloud",
        "firmware_version": "17.06.01a",
        "serial_number": "9AZURECSR0012",
        "mac_address": "00:0D:3A:44:55:66",
        "location": "Azure West US",
        "rack": "Azure VNet Slot",
        "warranty_expiry": "2030-01-01",
        "tags": "Cloud, ExpressRoute, BGP",
        "device_group": "Cloud Infrastructure",
        "status": "Online",
        "latency": 32.10,
        "last_checked": now_utc - timedelta(minutes=9),
        "notes": "Cloud Services Router handling BGP routing over Azure ExpressRoute."
    },
    {
        "hostname": "DMZ-SW-01",
        "ip_address": "192.168.100.2",
        "device_type": "Switch",
        "vendor": "Juniper",
        "model": "EX3400-24T",
        "operating_system": "Junos OS 20.4R3",
        "firmware_version": "20.4R3.8",
        "serial_number": "GG0219400192",
        "mac_address": "64:64:4B:12:34:56",
        "location": "Headquarters",
        "rack": "Rack-A03 (U04)",
        "warranty_expiry": "2026-10-31",
        "tags": "DMZ, Isolated, External",
        "device_group": "Security Infrastructure",
        "status": "Online",
        "latency": 1.78,
        "last_checked": now_utc - timedelta(minutes=2),
        "notes": "Isolated L2 switch carrying DMZ public-facing web server VLANs."
    }
]

def seed_database():
    """Seeds initial team users, network devices, notifications, and telemetry logs."""
    # Guarantee fresh user re-seeding by clearing existing users table
    try:
        User.query.delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error resetting users table: {e}")

    print("Re-seeding NOC team users with fresh admin password 'Admin@2026'...")
    for user_data in SEED_USERS:
        u = User(
            full_name=user_data['full_name'],
            email=user_data['email'],
            role=user_data['role'],
            status=user_data['status']
        )
        u.set_password("Admin@2026")
        db.session.add(u)
    db.session.commit()
    print(f"Successfully seeded {len(SEED_USERS)} NOC operators & team users with password 'Admin@2026'.")

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
