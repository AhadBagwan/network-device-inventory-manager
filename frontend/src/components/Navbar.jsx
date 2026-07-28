import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiServer, 
  HiLightningBolt, 
  HiDownload, 
  HiPlus, 
  HiMenuAlt2, 
  HiClock, 
  HiCog, 
  HiShieldCheck,
  HiLockClosed,
  HiLogout
} from 'react-icons/hi';
import { HiOutlineSignal, HiExclamationTriangle } from 'react-icons/hi2';
import ThemeSwitcher from './ThemeSwitcher';
import AdminLoginModal from './AdminLoginModal';
import { useAuth } from '../context/AuthContext';

const Navbar = ({
  onPingAll,
  onExport,
  onAddDevice,
  onOpenSettings,
  toggleSidebar,
  isPingingAll,
  settings
}) => {
  const { isAdmin, adminUser, logoutAdmin } = useAuth();
  const [time, setTime] = useState(new Date());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddDeviceClick = () => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
    } else {
      onAddDevice();
    }
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Maintenance Mode Alert Banner */}
      {settings?.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-pulse">
          <HiExclamationTriangle className="w-4 h-4" />
          <span>SYSTEM MAINTENANCE IN PROGRESS • Telemetry Probing is in Read-Only Mode</span>
        </div>
      )}

      <header className="bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 lg:px-6 py-3 transition-colors">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Left branding & mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              aria-label="Toggle Sidebar"
            >
              <HiMenuAlt2 className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-[var(--accent-color)] shadow-lg shadow-cyan-500/10">
                <HiOutlineSignal className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-base sm:text-lg tracking-tight text-[var(--text-main)]">
                    {settings?.nocName || 'NOC Inventory Manager'}
                  </h1>
                  {isAdmin ? (
                    <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <HiShieldCheck className="w-3 h-3" />
                      ADMIN
                    </span>
                  ) : (
                    <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      NOC LIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                  Network Operations Center • Asset Telemetry & Infrastructure Management
                </p>
              </div>
            </div>
          </div>

          {/* Center Live Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-mono text-[var(--text-muted)]">
            <HiClock className="w-4 h-4 text-[var(--accent-color)]" />
            <span>{time.toLocaleTimeString()} Local</span>
            <span className="text-[var(--border-color)]">|</span>
            <span>{time.toISOString().substring(11, 19)} UTC</span>
          </div>

          {/* Right Quick Actions & Admin Portal */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />

            {/* Admin Portal Button */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
              title="Open Admin Portal"
            >
              <HiShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="NOC Settings & System Configuration"
            >
              <HiCog className="w-5 h-5 text-[var(--accent-color)]" />
            </button>

            <button
              onClick={onPingAll}
              disabled={isPingingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
              title="Ping all stored inventory devices"
            >
              <HiLightningBolt className={`w-4 h-4 ${isPingingAll ? 'animate-bounce' : ''}`} />
              <span className="hidden md:inline">{isPingingAll ? 'Pinging...' : 'Ping All'}</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 text-xs sm:text-sm font-semibold transition-all"
              title="Export full inventory as CSV"
            >
              <HiDownload className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </button>

            <button
              onClick={handleAddDeviceClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
            >
              <HiPlus className="w-4 h-4 stroke-[3]" />
              <span>Add Device</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Login Popup */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => onAddDevice()}
      />
    </div>
  );
};

export default Navbar;
