import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HiServer, 
  HiLightningBolt, 
  HiDownload, 
  HiPlus, 
  HiMenuAlt2, 
  HiClock, 
  HiCog, 
  HiShieldCheck,
  HiLogout,
  HiBookOpen,
  HiInformationCircle,
  HiChartBar,
  HiCollection
} from 'react-icons/hi';
import { HiOutlineSignal } from 'react-icons/hi2';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = ({
  onPingAll,
  onExport,
  onAddDevice,
  toggleSidebar,
  isPingingAll
}) => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

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

        {/* Center Nav Links (when authenticated) */}
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

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all"
                title="Log Out of NOC Portal"
              >
                <HiLogout className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
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
