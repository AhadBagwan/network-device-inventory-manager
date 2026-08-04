import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VendorChart from '../components/VendorChart';
import DeviceChart from '../components/DeviceChart';
import { getStatistics, getDevices } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  HiChartBar, 
  HiCheckCircle, 
  HiXCircle, 
  HiClock, 
  HiShieldCheck, 
  HiServer, 
  HiRefresh 
} from 'react-icons/hi';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, devicesData] = await Promise.all([
        getStatistics(),
        getDevices()
      ]);
      setStats(statsData);
      setDevices(devicesData);
    } catch (err) {
      toast.error('Failed to load analytics telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Toaster position="top-right" />
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} stats={stats} />

        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
                <HiChartBar className="w-6 h-6 text-[var(--accent-color)]" />
                Network Infrastructure Analytics
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Real-time telemetry, vendor distribution, health scoring & maintenance tracking
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-semibold hover:bg-[var(--bg-hover)] transition-colors"
            >
              <HiRefresh className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {/* Top Key Performance Metric Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score */}
            <div className="noc-card p-4 rounded-xl flex items-center justify-between bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30">
              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">Network Health Score</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                  {stats?.health_score ?? 98}%
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono">Optimal Performance</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <HiShieldCheck className="w-7 h-7" />
              </div>
            </div>

            {/* SLA Availability */}
            <div className="noc-card p-4 rounded-xl flex items-center justify-between bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/30">
              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">SLA Availability</span>
                <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
                  {stats?.online_percentage ?? 100}%
                </div>
                <span className="text-[10px] text-cyan-400/80 font-mono">Excludes Maintenance</span>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                <HiCheckCircle className="w-7 h-7" />
              </div>
            </div>

            {/* Avg Latency */}
            <div className="noc-card p-4 rounded-xl flex items-center justify-between bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-purple-500/30">
              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">Average ICMP Latency</span>
                <div className="text-2xl font-extrabold font-mono text-purple-400 mt-1">
                  {stats?.avg_latency ? `${stats.avg_latency} ms` : '0.0 ms'}
                </div>
                <span className="text-[10px] text-purple-400/80 font-mono">Active Response Time</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <HiClock className="w-7 h-7" />
              </div>
            </div>

            {/* Maintenance Mode Count */}
            <div className="noc-card p-4 rounded-xl flex items-center justify-between bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/30">
              <div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">Scheduled Maintenance</span>
                <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
                  {stats?.maintenance_devices ?? 1} Assets
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono">Zero Outage Impact</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <HiShieldCheck className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Visual Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VendorChart data={stats?.vendor_breakdown} />
            <DeviceChart data={stats?.type_breakdown} />
          </div>

          {/* Recent Devices Summary Table */}
          <div className="noc-card p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
                <HiServer className="w-4 h-4 text-[var(--accent-color)]" />
                Infrastructure Inventory Summary
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Showing top active assets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[var(--bg-main)] text-[var(--text-muted)] border-b border-[var(--border-color)]">
                    <th className="py-2.5 px-3">Hostname</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {devices.slice(0, 7).map((d) => (
                    <tr key={d.id} className="hover:bg-[var(--bg-hover)]">
                      <td className="py-2.5 px-3 font-bold text-[var(--text-main)]">{d.hostname}</td>
                      <td className="py-2.5 px-3 text-cyan-400">{d.ip_address}</td>
                      <td className="py-2.5 px-3 font-sans text-[var(--text-main)]">{d.vendor}</td>
                      <td className="py-2.5 px-3 font-sans text-[var(--text-muted)]">{d.device_type}</td>
                      <td className="py-2.5 px-3 font-sans">
                        {d.status === 'Online' && <span className="text-emerald-400 font-bold">🟢 Online</span>}
                        {d.status === 'Offline' && <span className="text-rose-400 font-bold">🔴 Offline</span>}
                        {d.status === 'Maintenance' && <span className="text-amber-400 font-bold">🟡 Maintenance</span>}
                        {d.status === 'Unknown' && <span className="text-slate-400 font-bold">⚪ Unknown</span>}
                      </td>
                      <td className="py-2.5 px-3 text-teal-400">{d.latency ? `${d.latency} ms` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
