import React from 'react';
import { 
  HiX, 
  HiLightningBolt, 
  HiPencil, 
  HiTrash, 
  HiServer, 
  HiChip, 
  HiLocationMarker, 
  HiClock, 
  HiDocumentText, 
  HiShieldCheck 
} from 'react-icons/hi';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Online':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </span>
      );
    case 'Offline':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          Offline
        </span>
      );
    case 'Maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Maintenance
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          Unknown
        </span>
      );
  }
};

const DeviceDrawer = ({ device, isOpen, onClose, onEdit, onDelete, onPing, pingingId }) => {
  if (!isOpen || !device) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <HiServer className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--text-main)] font-mono">
                  {device.hostname}
                </h2>
                <p className="text-xs text-cyan-400 font-mono">{device.ip_address}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Latency Card */}
          <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Current Operational Status
              </span>
              <div>{getStatusBadge(device.status)}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase block">
                Response Latency
              </span>
              <span className="text-sm font-bold font-mono text-teal-400">
                {device.latency !== null ? `${device.latency.toFixed(2)} ms` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Hardware Specs Grid */}
          <div className="space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <HiChip className="w-4 h-4 text-[var(--accent-color)]" />
              Hardware Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Vendor</span>
                <span className="font-bold text-[var(--text-main)]">{device.vendor}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Device Type</span>
                <span className="font-bold text-[var(--text-main)]">{device.device_type}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Model</span>
                <span className="font-bold text-[var(--text-main)] truncate">{device.model}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Serial Number</span>
                <span className="font-bold text-[var(--text-main)] truncate">{device.serial_number || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] col-span-2">
                <span className="text-[10px] text-[var(--text-muted)] block">MAC Address</span>
                <span className="font-bold text-cyan-400">{device.mac_address || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] col-span-2">
                <span className="text-[10px] text-[var(--text-muted)] block">Operating System</span>
                <span className="font-bold text-[var(--text-main)]">{device.operating_system || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Physical Location */}
          <div className="space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
              <HiLocationMarker className="w-4 h-4 text-[var(--accent-color)]" />
              Facility & Placement
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Facility Location</span>
                <span className="font-bold text-[var(--text-main)]">{device.location}</span>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Rack Unit</span>
                <span className="font-bold text-[var(--text-main)]">{device.rack || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          {device.notes && (
            <div className="space-y-2 font-mono text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                <HiDocumentText className="w-4 h-4 text-[var(--accent-color)]" />
                Operational Notes
              </h3>
              <p className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] leading-relaxed">
                {device.notes}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-6 border-t border-[var(--border-color)] flex items-center gap-3">
          <button
            onClick={() => onPing(device.id)}
            disabled={pingingId === device.id}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-bold transition-all disabled:opacity-50"
          >
            <HiLightningBolt className={`w-4 h-4 ${pingingId === device.id ? 'animate-bounce' : ''}`} />
            <span>{pingingId === device.id ? 'Pinging...' : 'Ping Device'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit(device);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold transition-all"
          >
            <HiPencil className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDelete(device);
            }}
            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all"
            title="Delete Device"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default DeviceDrawer;
