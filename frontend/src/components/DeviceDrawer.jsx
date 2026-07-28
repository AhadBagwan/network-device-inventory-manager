import React from 'react';
import { 
  HiX, 
  HiLightningBolt, 
  HiPencil, 
  HiServer, 
  HiLocationMarker, 
  HiChip, 
  HiDocumentText, 
  HiClock,
  HiShieldCheck
} from 'react-icons/hi';
import { TbRouter } from 'react-icons/tb';

const DeviceDrawer = ({ device, isOpen, onClose, onPing, onEdit, isPinging }) => {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-main)]/50">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                {device.device_type}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--accent-color)]">
                <TbRouter className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-main)] font-mono tracking-tight">
                  {device.hostname}
                </h2>
                <p className="text-xs text-cyan-400 font-mono font-semibold">
                  {device.ip_address}
                </p>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6 flex-1 text-xs">
            {/* Status & Latency summary card */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] font-mono">
              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Status
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      device.status === 'Online'
                        ? 'bg-emerald-400 animate-pulse'
                        : device.status === 'Offline'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={
                      device.status === 'Online'
                        ? 'text-emerald-400'
                        : device.status === 'Offline'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }
                  >
                    {device.status}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Latency
                </div>
                <div className="font-bold text-teal-400">
                  {device.latency !== null ? `${device.latency.toFixed(2)} ms` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Network Hardware Specs */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <HiChip className="w-4 h-4 text-[var(--accent-color)]" />
                Hardware Metadata
              </h4>

              <div className="space-y-2 font-mono bg-[var(--bg-main)]/40 p-3 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                  <span className="text-[var(--text-muted)] font-sans">Vendor</span>
                  <span className="font-semibold text-[var(--text-main)]">{device.vendor}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                  <span className="text-[var(--text-muted)] font-sans">Model</span>
                  <span className="font-semibold text-[var(--text-main)]">{device.model}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                  <span className="text-[var(--text-muted)] font-sans">OS / Firmware</span>
                  <span className="font-semibold text-[var(--text-main)]">
                    {device.operating_system || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                  <span className="text-[var(--text-muted)] font-sans">Serial Number</span>
                  <span className="font-semibold text-amber-400">{device.serial_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-sans">MAC Address</span>
                  <span className="font-semibold text-cyan-400">{device.mac_address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Location & Rack Placement */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                <HiLocationMarker className="w-4 h-4 text-[var(--accent-color)]" />
                Physical Placement
              </h4>

              <div className="space-y-2 font-mono bg-[var(--bg-main)]/40 p-3 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                  <span className="text-[var(--text-muted)] font-sans">Facility / Location</span>
                  <span className="font-semibold text-[var(--text-main)]">{device.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] font-sans">Rack Unit</span>
                  <span className="font-semibold text-indigo-400">{device.rack || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            {/* Notes & Audit Timestamps */}
            {device.notes && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <HiDocumentText className="w-4 h-4 text-[var(--accent-color)]" />
                  Operator Notes
                </h4>
                <div className="p-3 rounded-xl bg-[var(--bg-main)]/40 border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {device.notes}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Action Footer */}
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)] flex gap-2">
            <button
              onClick={() => onPing(device.id)}
              disabled={isPinging}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold transition-all disabled:opacity-50"
            >
              <HiLightningBolt className={`w-4 h-4 ${isPinging ? 'animate-bounce' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Ping Device'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(device);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] font-bold transition-all"
            >
              <HiPencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDrawer;
