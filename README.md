# 🌐 NetPulse - Network Device Inventory & Monitoring Dashboard

> A production-grade, enterprise Network Operations Center (NOC) inventory & telemetry monitoring platform built with **React 18, Vite, Tailwind CSS, Python 3.12, Flask, Flask-JWT-Extended, SQLAlchemy, Ping3, and Pandas**.

[![GitHub license](https://img.shields.io/github/license/AhadBagwan/network-device-inventory-manager)](https://github.com/AhadBagwan/network-device-inventory-manager/blob/main/LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Python%203.12%20%2B%20Flask-green)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/Security-JWT%20Bearer%20Auth-amber)](https://flask-jwt-extended.readthedocs.io/)

---

## 📌 Project Overview

**NetPulse** represents an internal NOC Operations Console engineered for Network Engineers, Systems Architects, and Security Operators. It delivers full-lifecycle asset tracking, ICMP latency trend logging, multi-select bulk operations, CSV batch importing, interactive 42U equipment rack cabinet inspection, SVG network topology visualization, and global keyboard command palette control.

---

## ✨ Key Features & Capability Matrix

### 🔐 1. Professional NOC Authentication System
- **JWT Authorization**: Secured endpoints via `Flask-JWT-Extended` and Werkzeug password hashing.
- **Operator Profile & Dropdown**: Relocated logout button into profile menu with user initials badge.
- **Default Operator Credentials**:
  - Email: `admin@netpulse.noc`
  - Password: `Admin@123`

### ⚡ 2. Telemetry & Live ICMP Probing
- **Real-Time Latency Probing**: Probes IP availability powered by `ping3` with automated socket fallbacks.
- **Ping History RTT Tracking**: Historical ICMP latency logs and trend views per asset.
- **Auto-Scan Refresh Interval**: Configurable background auto-probing interval (*Off / 30s / 60s / 5m*).
- **NOC Event Alerts**: Real-time notifications for critical host outages, maintenance windows, and system logs.

### 📥 3. Batch Inventory Import & Export
- **CSV Batch Import Engine**: Parse inventory CSV files via Pandas with IP/hostname deduplication & row-by-row validation error reports.
- **Sample CSV Template Download**: Download pre-formatted CSV template.
- **1-Click CSV Export**: Download inventory report with single click.

### 📑 4. Multi-Select & Bulk Actions
- **Checkbox Table Multi-Select**: Row checkboxes and "Select All" header toggle.
- **Floating Bulk Actions Bar**: Perform `Ping Selected`, `Set Maintenance`, or `Delete Selected` on multiple assets simultaneously.

### 🎨 5. Enhanced Asset Metadata & Custom NOC Themes
- **Enterprise Asset Fields**: Tags (`#Core`, `#Critical`, `#DMZ`), Device Group (`Datacenter Core`, `HQ Infrastructure`), Firmware Version, and Warranty Expiry Date.
- **6 Curated NOC Themes**: Toggle between **Cyberpunk Dark**, **Grafana Blue**, **Matrix Cyber Green**, **Deep Purple**, **Solarized Dark**, and **Light NOC**. Choice previewed with color swatches.

### 🛠️ 6. Enterprise Productivity & Visualizations
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Keyboard-driven global search across assets, routes, and quick actions.
- **Keyboard Shortcuts Helper (`?`)**: Operator hotkey cheat sheet modal.
- **42U Rack Cabinet Inspector**: Visual 42U equipment chassis view (U1 to U42) showing slot placement and status badges.
- **Interactive SVG Topology Map**: Visual node-link network map showing Core Routers, Switches, Firewalls, Servers, and APs connected with status link lines.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS Variables & Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with JWT Bearer Interceptors
- **Charts & Visualizations**: Recharts & Custom SVG Node Link Diagrams
- **Icons & Notifications**: React Icons & React Hot Toast

### Backend
- **Language**: Python 3.12
- **Framework**: Flask, Flask-CORS, Flask-JWT-Extended
- **Database ORM**: Flask-SQLAlchemy (SQLite in WAL Mode for concurrency)
- **Ping Execution**: Ping3 & Python `socket` module
- **Data Processing**: Pandas & Python `io`
- **WSGI Server**: Gunicorn

---

## 📁 Project Architecture & Directory Structure

```
network-device-inventory-manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar with Profile & Quick Actions
│   │   │   ├── Sidebar.jsx              # Navigation sidebar & health metrics widget
│   │   │   ├── DashboardCards.jsx       # Animated telemetry statistic cards
│   │   │   ├── DeviceTable.jsx          # Asset table with checkboxes & sticky header
│   │   │   ├── DeviceDrawer.jsx         # Detailed asset slide-over inspector
│   │   │   ├── DeviceModal.jsx          # Add/Edit device asset modal with validation
│   │   │   ├── ImportModal.jsx          # CSV batch upload & template download modal
│   │   │   ├── CommandPalette.jsx       # Global Ctrl+K command search palette
│   │   │   ├── KeyboardShortcutsModal.jsx# Hotkeys cheat sheet overlay
│   │   │   ├── RackDiagramModal.jsx     # Visual 42U equipment rack cabinet inspector
│   │   │   ├── TopologyMap.jsx          # SVG node-link network topology map
│   │   │   ├── RecentAlerts.jsx         # NOC system event notification alerts
│   │   │   ├── RecentActivity.jsx       # NOC activity audit log timeline
│   │   │   ├── ThemeSwitcher.jsx        # Theme dropdown with color swatches
│   │   │   └── Filters.jsx              # Multi-parameter filter controls
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # JWT authentication context
│   │   │   └── ThemeContext.jsx         # Theme context manager
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            # Operations NOC dashboard controller
│   │   │   ├── Analytics.jsx            # Infrastructure analytics page
│   │   │   ├── Login.jsx                # Operator login page
│   │   │   └── Register.jsx             # Operator registration page
│   │   └── services/
│   │       └── api.js                   # Axios HTTP client with JWT interceptors
│   ├── vercel.json                      # Vercel SPA routing redirects
│   └── package.json
│
├── backend/
│   ├── app.py                           # Flask app entry point
│   ├── models.py                        # SQLAlchemy models (User, Device, PingHistory, Activity, Notification)
│   ├── database.py                      # SQLAlchemy instance with SQLite WAL mode
│   ├── routes.py                        # REST API routes & validation
│   ├── seed.py                          # Database seed script (15 default assets)
│   ├── Procfile                         # Production WSGI gunicorn deployment file
│   └── requirements.txt                 # Python backend dependencies
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/AhadBagwan/network-device-inventory-manager.git
cd network-device-inventory-manager
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Launch Flask Backend Server
python app.py
```
*Backend runs live at `http://127.0.0.1:5000`*

### 3. Frontend Setup
```bash
cd ../frontend

# Install node dependencies
npm install

# Launch Vite Development Server
npm run dev
```
*Frontend runs live at `http://localhost:5173`*

---

## 📡 Key REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate operator & issue JWT token | No |
| `POST` | `/api/register` | Register new administrator account | No |
| `GET` | `/api/devices` | Get devices with filtering, sorting & search | Yes |
| `POST` | `/api/devices` | Add new device asset with IPv4 validation | Yes |
| `PUT` | `/api/devices/<id>` | Update existing device asset specifications | Yes |
| `DELETE` | `/api/devices/<id>` | Delete device asset | Yes |
| `POST` | `/api/devices/import` | Upload & batch import devices from CSV | Yes |
| `POST` | `/api/devices/bulk-delete` | Batch delete selected device IDs | Yes |
| `POST` | `/api/devices/bulk-status` | Batch update operational status | Yes |
| `POST` | `/api/devices/ping/<id>` | Probe single device IP via ICMP | Yes |
| `POST` | `/api/devices/ping-all` | Execute bulk ping scan across all assets | Yes |
| `GET` | `/api/notifications` | Get NOC system alert notifications | Yes |
| `GET` | `/api/statistics` | Get aggregate health metrics & breakdown stats | Yes |

---

## ☁️ Production Hosting

### Frontend (Vercel)
- Set **Root Directory** to `frontend`.
- Set Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

### Backend (Render)
- Set **Root Directory** to `backend`.
- Set **Build Command**: `pip install -r requirements.txt`
- Set **Start Command**: `gunicorn app:app`

---

## 📜 License

Distributed under the **MIT License**.

*Engineered with precision for Network Operations Centers.*
