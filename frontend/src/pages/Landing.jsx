import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiServer, 
  HiLightningBolt, 
  HiDownload, 
  HiSearch, 
  HiFilter, 
  HiChartPie, 
  HiClock, 
  HiColorSwatch, 
  HiViewList, 
  HiRefresh, 
  HiDeviceMobile,
  HiShieldCheck,
  HiArrowRight,
  HiBookOpen
} from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

const FEATURES = [
  {
    title: 'Network Device Inventory',
    desc: 'Centralized repository tracking Cisco, Fortinet, Juniper, Dell, Palo Alto, and Ubiquiti hardware.',
    icon: HiServer,
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30'
  },
  {
    title: 'Real-time Ping Probing',
    desc: 'ICMP response time measurement with automatic TCP port fallback for restricted OS permissions.',
    icon: HiLightningBolt,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30'
  },
  {
    title: 'CSV Audit Export',
    desc: 'Export complete inventory records into Pandas-formatted CSV files with one click.',
    icon: HiDownload,
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-blue-500/5 border-blue-500/30'
  },
  {
    title: 'Instant Multi-Field Search',
    desc: 'Filter assets in real-time by Hostname, IPv4, Vendor, Model, Location, or OS.',
    icon: HiSearch,
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-500/5 border-amber-500/30'
  },
  {
    title: 'Multi-Parameter Filtering',
    desc: 'Narrow inventory by Vendor, Device Type, Online/Offline/Maintenance Status, or Facility Location.',
    icon: HiFilter,
    color: 'text-purple-400',
    bg: 'from-purple-500/10 to-purple-500/5 border-purple-500/30'
  },
  {
    title: 'Network Health Analytics',
    desc: 'Interactive Recharts donut and bar charts calculating SLA availability and health scores.',
    icon: HiChartPie,
    color: 'text-teal-400',
    bg: 'from-teal-500/10 to-teal-500/5 border-teal-500/30'
  },
  {
    title: 'Maintenance Mode (NOC)',
    desc: 'Mark hardware for scheduled maintenance without triggering false outage alerts.',
    icon: HiShieldCheck,
    color: 'text-yellow-400',
    bg: 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/30'
  },
  {
    title: 'Activity Audit Trail Logs',
    desc: 'Track every NOC event including user logins, asset additions, edits, deletions, and bulk pings.',
    icon: HiClock,
    color: 'text-rose-400',
    bg: 'from-rose-500/10 to-rose-500/5 border-rose-500/30'
  },
  {
    title: '6 Custom NOC Themes',
    desc: 'Switch between Dark, Cyber Blue, Cyber Green, Purple, Slate, and Light Mode saved in LocalStorage.',
    icon: HiColorSwatch,
    color: 'text-indigo-400',
    bg: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/30'
  },
  {
    title: 'Device Metadata Drawer',
    desc: 'Right slide-over inspector displaying MAC, Serial Number, Rack Placement, and Firmware notes.',
    icon: HiViewList,
    color: 'text-sky-400',
    bg: 'from-sky-500/10 to-sky-500/5 border-sky-500/30'
  },
  {
    title: 'Network-Wide Bulk Ping',
    desc: 'Ping all inventory devices simultaneously and refresh availability metrics automatically.',
    icon: HiRefresh,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30'
  },
  {
    title: 'Responsive NOC Design',
    desc: 'Optimized layout for Desktop, Tablet, and Mobile with collapsible drawer sidebar.',
    icon: HiDeviceMobile,
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30'
  }
];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors flex flex-col justify-between">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-[var(--accent-color)] shadow-lg shadow-cyan-500/10">
              <HiOutlineSignal className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight font-mono text-[var(--text-main)]">
              NetPulse NOC
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-muted)]">
            <a href="#features" className="hover:text-[var(--text-main)] transition-colors">Features</a>
            <Link to="/guide" className="hover:text-[var(--text-main)] transition-colors">Guide</Link>
            <Link to="/about" className="hover:text-[var(--text-main)] transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              NOC Telemetry & Asset Management Platform
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
              Enterprise Network Asset Inventory & Real-Time Probing
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-mono">
              Maintain hardware inventory, monitor ICMP telemetry, track scheduled maintenance windows, and audit network events in a high-performance internal NOC portal.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleGetStarted}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold shadow-xl shadow-cyan-500/20 hover:opacity-90 transition-all transform active:scale-95 text-xs sm:text-sm"
              >
                <span>Get Started</span>
                <HiArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://github.com/AhadBagwan/network-device-inventory-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] font-semibold hover:bg-[var(--bg-hover)] transition-all text-xs sm:text-sm"
              >
                GitHub Repository
              </a>

              <Link
                to="/guide"
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold text-xs sm:text-sm"
              >
                <HiBookOpen className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Operator Guide</span>
              </Link>
            </div>
          </motion.div>

          {/* Hero Illustration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="noc-card p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 shadow-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-[var(--text-muted)] ml-2">noc-telemetry.netpulse.io</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  HEALTH 98.5%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-white">HQ-CORE-RTR-01</span>
                  <span className="text-cyan-400">192.168.1.1</span>
                  <span className="text-emerald-400 font-bold">2.45 ms</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-white">DC-SW-9300</span>
                  <span className="text-cyan-400">192.168.1.10</span>
                  <span className="text-emerald-400 font-bold">1.12 ms</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-white">DC-SW-MAINT</span>
                  <span className="text-cyan-400">192.168.1.11</span>
                  <span className="text-amber-400 font-bold">🟡 Maintenance</span>
                </div>
              </div>

              <div className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)] flex justify-between">
                <span>Total Assets: 15</span>
                <span>Production Telemetry API</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="px-4 lg:px-8 py-16 bg-[var(--bg-card)]/40 border-t border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              Enterprise NOC Feature Showcase
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono">
              Designed specifically for Network Engineers, Systems Administrators, and NOC Operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={`noc-card p-5 rounded-2xl bg-gradient-to-b ${feat.bg} hover:scale-[1.03] transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] w-fit ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-main)]">{feat.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="px-4 lg:px-8 py-8 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>NetPulse NOC Inventory Manager • Production Telemetry System</span>
          </div>
          <div className="flex gap-4">
            <Link to="/guide" className="hover:text-[var(--text-main)]">Guide</Link>
            <Link to="/about" className="hover:text-[var(--text-main)]">About</Link>
            <a href="https://github.com/AhadBagwan/network-device-inventory-manager" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-main)]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
