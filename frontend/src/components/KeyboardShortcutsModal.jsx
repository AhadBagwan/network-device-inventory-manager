import React from 'react';
import { HiX, HiLightningBolt, HiSearch, HiPlus, HiDownload, HiUpload, HiRefresh } from 'react-icons/hi';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K / Cmd + K', description: 'Open Global Command Palette search', icon: HiSearch },
    { key: 'Shift + A', description: 'Add new network device asset', icon: HiPlus },
    { key: 'Shift + P', description: 'Execute network-wide bulk ping scan', icon: HiLightningBolt },
    { key: 'Shift + E', description: 'Export full inventory database to CSV', icon: HiDownload },
    { key: 'Shift + I', description: 'Import network devices from CSV file', icon: HiUpload },
    { key: 'Shift + R', description: 'Refresh inventory telemetry data', icon: HiRefresh },
    { key: '?', description: 'Open Keyboard Shortcuts helper overlay', icon: HiX }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]/60">
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)] font-mono">
                Operator Keyboard Shortcuts
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                NOC Command Center Hotkeys
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-2 text-xs font-mono">
            {shortcuts.map((sc, idx) => {
              const Icon = sc.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--accent-color)]" />
                    <span className="text-[var(--text-main)]">{sc.description}</span>
                  </div>
                  <kbd className="px-2 py-1 rounded bg-[var(--bg-card)] text-cyan-400 border border-[var(--border-color)] font-bold text-[10px]">
                    {sc.key}
                  </kbd>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)] text-right">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[var(--accent-color)] text-slate-950 font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
