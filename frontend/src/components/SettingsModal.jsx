import React, { useState } from 'react';
import { 
  HiX, 
  HiCog, 
  HiAdjustments, 
  HiRefresh, 
  HiCheckCircle, 
  HiTrash, 
  HiColorSwatch, 
  HiServer, 
  HiShieldCheck,
  HiLightningBolt,
  HiExclamation
} from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetInventory,
  onClearActivities
}) => {
  const { theme, changeTheme, THEMES } = useTheme();

  const [activeTab, setActiveTab] = useState('general');
  const [nocName, setNocName] = useState(settings?.nocName || 'Enterprise Operations Center');
  const [autoRefresh, setAutoRefresh] = useState(settings?.autoRefresh || '10');
  const [pingTimeout, setPingTimeout] = useState(settings?.pingTimeout || '2');
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode || false);
  const [subnet, setSubnet] = useState(settings?.subnet || '192.168.1.0/24');

  const [confirmReset, setConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      nocName,
      autoRefresh: parseInt(autoRefresh),
      pingTimeout: parseInt(pingTimeout),
      maintenanceMode,
      subnet
    });
    onClose();
  };

  const handleExecuteReset = async () => {
    setIsResetting(true);
    await onResetInventory();
    setIsResetting(false);
    setConfirmReset(false);
  };

  const handleExecuteClearLogs = async () => {
    setIsClearing(true);
    await onClearActivities();
    setIsClearing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 text-[var(--accent-color)]">
                <HiCog className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  NOC System Settings & Diagnostics
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Configure NOC telemetry, probing controls, and preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-main)]/30 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--bg-hover)]/50'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <HiAdjustments className="w-4 h-4" />
              <span>General & Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
                activeTab === 'theme'
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--bg-hover)]/50'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <HiColorSwatch className="w-4 h-4" />
              <span>NOC Themes (6)</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors ${
                activeTab === 'system'
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] bg-[var(--bg-hover)]/50'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <HiServer className="w-4 h-4" />
              <span>Maintenance & Data</span>
            </button>
          </div>

          {/* Body Content */}
          <form onSubmit={handleSave} className="p-6 space-y-5 text-xs">
            {activeTab === 'general' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    NOC Facility Name
                  </label>
                  <input
                    type="text"
                    value={nocName}
                    onChange={(e) => setNocName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                    placeholder="e.g. Global Operations Control Center"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Auto-Refresh Interval (Seconds)
                  </label>
                  <select
                    value={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
                  >
                    <option value="0">Disabled (Manual Refresh)</option>
                    <option value="5">Every 5 Seconds</option>
                    <option value="10">Every 10 Seconds (Recommended)</option>
                    <option value="30">Every 30 Seconds</option>
                    <option value="60">Every 60 Seconds</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      ICMP Ping Timeout (Seconds)
                    </label>
                    <select
                      value={pingTimeout}
                      onChange={(e) => setPingTimeout(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
                    >
                      <option value="1">1 Second (Fast)</option>
                      <option value="2">2 Seconds (Default)</option>
                      <option value="4">4 Seconds (WAN Latency)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Primary Management Subnet
                    </label>
                    <input
                      type="text"
                      value={subnet}
                      onChange={(e) => setSubnet(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                  <div>
                    <span className="font-bold text-[var(--text-main)] block">NOC Maintenance Mode</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Displays maintenance warning banner across NOC header
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      maintenanceMode
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]'
                    }`}
                  >
                    {maintenanceMode ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="text-xs text-[var(--text-muted)] font-mono mb-2">
                  Select your preferred NOC dashboard color scheme. Choice will persist in LocalStorage.
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => changeTheme(t.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all ${
                        theme === t.id
                          ? 'border-[var(--accent-color)] ring-1 ring-[var(--accent-color)] shadow-lg'
                          : 'border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
                      }`}
                      style={{ backgroundColor: t.bg }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: t.color }}
                        />
                        {theme === t.id && (
                          <HiCheckCircle className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs" style={{ color: t.type === 'light' ? '#0f172a' : '#f8fafc' }}>
                          {t.name}
                        </div>
                        <div className="text-[10px] opacity-70 font-mono" style={{ color: t.type === 'light' ? '#64748b' : '#94a3b8' }}>
                          {t.type.toUpperCase()} NOC
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-main)]">System Health Status</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                      <HiShieldCheck className="w-4 h-4" />
                      100% ONLINE
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono space-y-1">
                    <div>Flask REST Backend: Running on 127.0.0.1:5000</div>
                    <div>Database Driver: SQLite 3.x SQLAlchemy ORM</div>
                    <div>Telemetry Ping Mode: ICMP Raw Socket Probing (Fallback Ready)</div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-color)] pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-main)] block">Clear Activity Timeline</span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Wipes NOC action audit trail history
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleExecuteClearLogs}
                      disabled={isClearing}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-bold transition-all disabled:opacity-50"
                    >
                      {isClearing ? 'Clearing...' : 'Clear Logs'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]/50">
                    <div>
                      <span className="font-bold text-[var(--text-main)] block">Reset Inventory Database</span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Restores default 15 enterprise network devices
                      </span>
                    </div>
                    {confirmReset ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteReset}
                          disabled={isResetting}
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
                        >
                          {isResetting ? 'Resetting...' : 'Confirm Reset'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-bold transition-all"
                      >
                        Reset Inventory
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                <HiCheckCircle className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
