import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiChartPie, 
  HiServer, 
  HiShieldCheck, 
  HiWifi, 
  HiDesktopComputer, 
  HiCollection,
  HiX,
  HiChip,
  HiCheckCircle,
  HiCog
} from 'react-icons/hi';
import { TbRouter } from 'react-icons/tb';

const Sidebar = ({ isOpen, onClose, selectedType, onSelectType, stats }) => {
  const navItems = [
    { label: 'All Devices', type: '', icon: HiCollection, count: stats?.total_devices || 0 },
    { label: 'Routers', type: 'Router', icon: TbRouter, count: stats?.routers || 0 },
    { label: 'Switches', type: 'Switch', icon: HiChip, count: stats?.switches || 0 },
    { label: 'Firewalls', type: 'Firewall', icon: HiShieldCheck, count: stats?.firewalls || 0 },
    { label: 'Servers', type: 'Server', icon: HiServer, count: stats?.servers || 0 },
    { label: 'Access Points', type: 'Access Point', icon: HiWifi, count: 0 },
    { label: 'Wireless Controllers', type: 'Wireless Controller', icon: HiDesktopComputer, count: 0 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile Sidebar Close Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-color)] lg:hidden">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-main)]">
              <HiChartPie className="w-5 h-5 text-[var(--accent-color)]" />
              NOC Telemetry
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-3">
            Device Categories
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedType === item.type;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onSelectType(item.type);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] border border-[var(--border-color)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent-color)]' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30'
                          : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-[var(--border-color)] space-y-1">
            <Link
              to="/admin"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <HiShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={() => {
                onOpenSettings();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)] transition-all"
            >
              <HiCog className="w-4 h-4 text-[var(--accent-color)]" />
              <span>NOC Settings</span>
            </button>
          </div>
        </div>

        {/* Bottom System Status Widget */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
          <div className="noc-card p-3 bg-[var(--bg-main)] rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-[var(--text-muted)]">NOC Health</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <HiCheckCircle className="w-3.5 h-3.5" />
                {stats?.online_percentage || 0}%
              </span>
            </div>
            <div className="w-full bg-[var(--border-color)] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats?.online_percentage || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span>Latency: {stats?.avg_latency || 0}ms</span>
              <span>Total: {stats?.total_devices || 0}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
