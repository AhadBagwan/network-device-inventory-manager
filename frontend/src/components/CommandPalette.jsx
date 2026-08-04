import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiSearch, 
  HiServer, 
  HiCollection, 
  HiChartBar, 
  HiBookOpen, 
  HiInformationCircle, 
  HiCog, 
  HiLightningBolt, 
  HiDownload, 
  HiUpload, 
  HiPlus,
  HiX
} from 'react-icons/hi';

const CommandPalette = ({
  isOpen,
  onClose,
  devices = [],
  onSelectDevice,
  onAddDevice,
  onPingAll,
  onExport,
  onImport
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Pages & Actions List
  const actions = [
    { id: 'page-dashboard', label: 'Navigate to NOC Dashboard', category: 'Navigation', icon: HiCollection, action: () => navigate('/dashboard') },
    { id: 'page-analytics', label: 'Navigate to Infrastructure Analytics', category: 'Navigation', icon: HiChartBar, action: () => navigate('/analytics') },
    { id: 'page-guide', label: 'Navigate to Operator Guide', category: 'Navigation', icon: HiBookOpen, action: () => navigate('/guide') },
    { id: 'page-about', label: 'Navigate to System Architecture & About', category: 'Navigation', icon: HiInformationCircle, action: () => navigate('/about') },
    { id: 'page-settings', label: 'Navigate to User Preferences & Settings', category: 'Navigation', icon: HiCog, action: () => navigate('/settings') },
    { id: 'act-add', label: 'Add New Network Device Asset', category: 'Quick Action', icon: HiPlus, action: () => onAddDevice && onAddDevice() },
    { id: 'act-ping-all', label: 'Execute Network-Wide Bulk Ping Probing', category: 'Quick Action', icon: HiLightningBolt, action: () => onPingAll && onPingAll() },
    { id: 'act-export', label: 'Export Inventory Database as CSV', category: 'Quick Action', icon: HiDownload, action: () => onExport && onExport() },
    { id: 'act-import', label: 'Import Devices from CSV File', category: 'Quick Action', icon: HiUpload, action: () => onImport && onImport() }
  ];

  // Filtered devices
  const filteredDevices = devices.filter(
    (d) =>
      d.hostname.toLowerCase().includes(query.toLowerCase()) ||
      d.ip_address.includes(query) ||
      d.vendor.toLowerCase().includes(query.toLowerCase()) ||
      d.location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5).map((d) => ({
    id: `dev-${d.id}`,
    label: `${d.hostname} (${d.ip_address}) - ${d.vendor} ${d.device_type}`,
    category: 'Network Asset',
    icon: HiServer,
    action: () => onSelectDevice && onSelectDevice(d)
  }));

  // Filtered Actions
  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...filteredDevices, ...filteredActions];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-start justify-center pt-20 p-4">
        <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Input Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
            <HiSearch className="w-5 h-5 text-[var(--accent-color)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search assets, pages, or quick actions... (Esc to close)"
              className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-main)] font-mono focus:outline-none placeholder-[var(--text-muted)]"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs font-mono">
            {allItems.length === 0 ? (
              <div className="p-6 text-center text-[var(--text-muted)]">
                No assets or actions match your query "{query}".
              </div>
            ) : (
              allItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] border border-[var(--border-color)] font-bold'
                        : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--text-muted)] border border-[var(--border-color)]">
                      {item.category}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Hotkeys Tip */}
          <div className="px-4 py-2 bg-[var(--bg-main)] border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>Navigation: ↑↓ Navigate | Enter Select | Esc Close</span>
            <span className="text-[var(--accent-color)] font-bold">NetPulse Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
