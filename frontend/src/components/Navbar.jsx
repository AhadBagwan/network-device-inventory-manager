import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HiServer, 
  HiLightningBolt, 
  HiDownload, 
  HiUpload,
  HiPlus, 
  HiMenuAlt2, 
  HiCog, 
  HiLogout,
  HiBookOpen,
  HiInformationCircle,
  HiChartBar,
  HiCollection,
  HiChevronDown,
  HiShieldCheck
} from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({
  onPingAll,
  onExport,
  onImport,
  onAddDevice,
  toggleSidebar,
  isPingingAll
}) => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border-color)] px-4 lg:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              aria-label="Toggle Sidebar"
            >
              <HiMenuAlt2 className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-[var(--accent-color)] shadow-lg shadow-cyan-500/10">
              <HiOutlineSignal className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[var(--text-main)] font-mono">
                  NetPulse NOC
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  NOC LIVE
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] hidden sm:block font-mono">
                Asset Telemetry & Infrastructure Management Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <HiCollection className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/analytics')
                  ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <HiChartBar className="w-4 h-4" />
              <span>Analytics</span>
            </Link>

            <Link
              to="/guide"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/guide')
                  ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <HiBookOpen className="w-4 h-4" />
              <span>Guide</span>
            </Link>

            <Link
              to="/about"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/about')
                  ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <HiInformationCircle className="w-4 h-4" />
              <span>About</span>
            </Link>

            <Link
              to="/settings"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <HiCog className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />

          {isAuthenticated ? (
            <>
              {onPingAll && (
                <button
                  onClick={onPingAll}
                  disabled={isPingingAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition-all disabled:opacity-50"
                  title="Ping all inventory devices"
                >
                  <HiLightningBolt className={`w-4 h-4 ${isPingingAll ? 'animate-bounce' : ''}`} />
                  <span className="hidden md:inline">{isPingingAll ? 'Pinging...' : 'Ping All'}</span>
                </button>
              )}

              {onImport && (
                <button
                  onClick={onImport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-semibold transition-all"
                  title="Import inventory assets from CSV file"
                >
                  <HiUpload className="w-4 h-4" />
                  <span className="hidden md:inline">Import</span>
                </button>
              )}

              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 text-xs font-semibold transition-all"
                  title="Export full inventory as CSV"
                >
                  <HiDownload className="w-4 h-4" />
                  <span className="hidden md:inline">Export</span>
                </button>
              )}

              {onAddDevice && (
                <button
                  onClick={onAddDevice}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
                >
                  <HiPlus className="w-4 h-4 stroke-[3]" />
                  <span className="hidden sm:inline">Add Device</span>
                </button>
              )}

              {/* Profile Dropdown Trigger */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-xs font-bold text-[var(--text-main)] transition-all shadow-sm"
                  title="User Profile & Account Settings"
                >
                  <div className="w-6 h-6 rounded-lg bg-[var(--accent-color)] text-slate-950 flex items-center justify-center text-xs font-black font-mono shadow-sm">
                    {getInitials(user?.full_name)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate font-sans">
                    {user?.full_name || 'Operator'}
                  </span>
                  <HiChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[var(--text-main)] truncate">
                          {user?.full_name || 'Administrator'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          ADMIN
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono truncate">
                        {user?.email || 'admin@netpulse.noc'}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
                        <HiShieldCheck className="w-3.5 h-3.5" />
                        <span>NOC Portal Authenticated</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-semibold font-mono">
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <HiCog className="w-4 h-4 text-[var(--accent-color)]" />
                        <span>User Preferences & Settings</span>
                      </Link>

                      <Link
                        to="/guide"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <HiBookOpen className="w-4 h-4 text-emerald-400" />
                        <span>NOC Operational Guide</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[var(--border-color)]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all"
                      >
                        <HiLogout className="w-4 h-4" />
                        <span>Log Out Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
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
  );
};

export default Navbar;
