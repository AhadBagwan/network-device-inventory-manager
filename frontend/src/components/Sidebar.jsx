import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HiCollection, 
  HiServer, 
  HiChartBar, 
  HiUsers,
  HiBookOpen, 
  HiCog, 
  HiInformationCircle, 
  HiLogout, 
  HiX
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose, selectedType, onSelectType, stats }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: HiCollection },
    { label: 'Devices', path: '/dashboard', icon: HiServer },
    { label: 'Analytics', path: '/analytics', icon: HiChartBar },
    { label: 'Team & Users', path: '/users', icon: HiUsers },
    { label: 'Guide', path: '/guide', icon: HiBookOpen },
    { label: 'Settings', path: '/settings', icon: HiCog },
    { label: 'About', path: '/about', icon: HiInformationCircle },
  ];

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

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
        <div className="space-y-6">
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] lg:hidden">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-main)] font-mono">
              <HiServer className="w-5 h-5 text-[var(--accent-color)]" />
              NetPulse NOC Menu
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-3">
              NOC Portal Navigation
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] border border-[var(--border-color)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-[var(--accent-color)]' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Device Type Filters Quick Link (if on Dashboard) */}
          {onSelectType && (
            <div className="space-y-1 pt-4 border-t border-[var(--border-color)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-3">
                Quick Category Filters
              </div>
              <div className="space-y-1 font-mono text-xs">
                {[
                  { label: 'All Devices', type: '' },
                  { label: 'Routers', type: 'Router' },
                  { label: 'Switches', type: 'Switch' },
                  { label: 'Firewalls', type: 'Firewall' },
                  { label: 'Servers', type: 'Server' }
                ].map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      onSelectType(cat.type);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                      selectedType === cat.type
                        ? 'text-[var(--accent-color)] font-bold bg-[var(--bg-hover)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    • {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account & System Status Bottom Widget */}
        <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
          {/* User Profile Card */}
          {user && (
            <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1 text-xs">
              <div className="font-bold text-[var(--text-main)] truncate">{user.full_name}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">{user.email}</div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all"
          >
            <HiLogout className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
