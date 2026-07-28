# 🌐 Network Device Inventory Manager (NOC Dashboard)

> A modern, full-stack Network Operations Center (NOC) inventory management system built with **React 18, Vite, Tailwind CSS, Python 3.12, Flask, SQLAlchemy, Ping3, and Pandas**.

![NOC Dashboard Preview](https://raw.githubusercontent.com/placeholder/noc-inventory/main/docs/dashboard-preview.png)

---

## 📌 Project Overview

The **Network Device Inventory Manager** is a production-like NOC telemetry dashboard engineered for Network Engineers, System Administrators, and NOC Operators. It provides centralized asset tracking, real-time ICMP ping probing, telemetry monitoring, multi-attribute filtering, instant live search, CSV inventory exporting, and interactive infrastructure distribution analytics.

---



## ✨ Key Features

- **🔐 Restricted NOC Admin Portal (`/admin`)**: Dedicated Master Administrator Console protected by login authentication (`Username: Admin`, `Password: admin@123`). Allows full CRUD inventory control, 1-click database re-seeding, log purging, and system maintenance toggles.
- **📊 Comprehensive NOC Metrics**: Live telemetry cards for Total Assets, Online/Offline status, Routers, Switches, Firewalls, Servers, Average Latency, and SLA Availability.
- **⚡ Single & Bulk Ping Probing**: Real-time ICMP response time probing powered by `ping3` with automated socket permission fallbacks.
- **🔍 Instant Live Search**: Filter assets instantly across Hostname, IPv4, Vendor, Model, Location, and OS.
- **🎯 Multi-Parameter Filtering & Sorting**: Filter by Vendor, Device Type, Status, and Location; sort table columns dynamically.
- **📑 Detailed Asset Slide-Over Drawer**: Inspect full technical metadata (MAC Address, Serial Number, Rack Placement, Firmware version, Operator Notes).
- **📥 CSV Inventory Export**: Download formatted CSV audit reports generated on-the-fly using Pandas.
- **🎨 4 Custom NOC Themes**: Seamlessly toggle between **Dark NOC (Default)**, **Professional Blue (Grafana style)**, **Cyber Green (Matrix style)**, and **Deep Purple**. Choice persisted in LocalStorage.
- **🌱 Automated Database Seeding**: Pre-loaded with 15 realistic enterprise assets (Cisco, Fortinet, Juniper, Dell, HP, Palo Alto, Ubiquiti, VMware).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Vanilla CSS Variables
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Charts & Visualizations**: Recharts
- **Animations & Icons**: Framer Motion & React Icons
- **Notifications**: React Hot Toast
- **State & Theme**: Context API & LocalStorage

### Backend
- **Language**: Python 3.12
- **Framework**: Flask & Flask-CORS
- **Database ORM**: Flask-SQLAlchemy (SQLite)
- **Ping Probing**: Ping3 & Python `socket` module
- **Validation**: Python `ipaddress` module & Regex
- **CSV Processing**: Pandas & Python `io`

---

## 📁 Folder Structure

```
network-device-inventory/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with live NOC clock & quick actions
│   │   │   ├── Sidebar.jsx         # Collapsible navigation & health widget
│   │   │   ├── DashboardCards.jsx  # Animated telemetry statistic cards
│   │   │   ├── DeviceTable.jsx     # Asset table with sticky header & pagination
│   │   │   ├── DeviceModal.jsx     # Add/Edit popup modal with validation
│   │   │   ├── DeleteModal.jsx     # Delete asset confirmation dialog
│   │   │   ├── SearchBar.jsx       # Instant search input
│   │   │   ├── Filters.jsx         # Vendor, Status, Type, Location dropdowns
│   │   │   ├── ThemeSwitcher.jsx   # Theme switcher dropdown (4 themes)
│   │   │   ├── VendorChart.jsx     # Donut chart for vendor breakdown
│   │   │   ├── DeviceChart.jsx     # Bar chart for device type breakdown
│   │   │   ├── RecentActivity.jsx  # NOC audit log activity timeline
│   │   │   └── DeviceDrawer.jsx    # Right slide-over detailed asset inspector
│   │   ├── pages/
│   │   │   └── Dashboard.jsx       # Primary NOC dashboard controller
│   │   ├── services/
│   │   │   └── api.js              # Axios backend API client
│   │   ├── context/
│   │   │   └── ThemeContext.jsx    # Theme switcher context manager
│   │   ├── App.jsx                 # Main Router entry
│   │   └── index.css               # Design system & NOC CSS tokens
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py                      # Flask app entry point & CORS initialization
│   ├── models.py                   # SQLAlchemy models (Device & Activity)
│   ├── database.py                 # SQLAlchemy db instance
│   ├── routes.py                   # REST API routes & input validation
│   ├── seed.py                     # Database seeding script (15 devices)
│   ├── config.py                   # Flask app configuration
│   ├── requirements.txt            # Python dependencies
│   └── services/
│       ├── ping_service.py         # ICMP ping execution & socket fallback
│       └── csv_service.py          # Pandas CSV generation service
│
└── README.md
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: 3.12 (or Python 3.10+)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/network-device-inventory.git
cd network-device-inventory
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server (will automatically seed SQLite database on first run)
python app.py
```
*Backend API will run at `http://127.0.0.1:5000`*

### 3. Frontend Setup
```bash
cd ../frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
*Frontend app will run at `http://localhost:5173`*

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/devices` | Get all inventory devices with search, filtering & sorting |
| `POST` | `/api/devices` | Create new device asset (validates IPv4, MAC, duplicates) |
| `GET` | `/api/devices/<id>` | Get single device asset details |
| `PUT` | `/api/devices/<id>` | Edit existing device asset |
| `DELETE` | `/api/devices/<id>` | Delete device asset & log activity |
| `POST` | `/api/devices/ping/<id>` | Execute ICMP ping probe on single device |
| `POST` | `/api/devices/ping-all` | Execute network-wide bulk ping scan |
| `GET` | `/api/devices/export` | Export inventory as downloadable CSV file |
| `GET` | `/api/statistics` | Aggregate telemetry stats & chart breakdowns |
| `GET` | `/api/activities` | Get 20 most recent NOC activity audit logs |

---

## ☁️ Deployment Instructions

### Frontend (Vercel)
1. Push project to GitHub.
2. Connect repository to [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Backend (Render)
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `gunicorn app:app` (or `python app.py`)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

*Engineered with precision for Network Operations Centers.*
