import React, { useState } from 'react';
import { HiX, HiServer, HiLocationMarker } from 'react-icons/hi';

const RackDiagramModal = ({ isOpen, onClose, devices = [], onSelectDevice }) => {
  const [selectedRack, setSelectedRack] = useState('Data Center');

  if (!isOpen) return null;

  // Filter devices by selected location
  const rackDevices = devices.filter(
    (d) => !selectedRack || d.location.toLowerCase().includes(selectedRack.toLowerCase())
  );

  // Generate 42U Slots (U42 at top to U1 at bottom)
  const uSlots = Array.from({ length: 42 }, (_, i) => 42 - i);

  // Helper to match device to U position
  const getDeviceForU = (uNum) => {
    return rackDevices.find((d) => {
      if (!d.rack) return false;
      const match = d.rack.match(/U(\d+)/i);
      return match && parseInt(match[1], 10) === uNum;
    });
  };

  const locations = Array.from(new Set(devices.map((d) => d.location)));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]/60">
            <div className="flex items-center gap-2">
              <HiServer className="w-6 h-6 text-[var(--accent-color)]" />
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)] font-mono">
                  42U Equipment Rack Cabinet Inspector
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Physical chassis placement & operational status
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedRack}
                onChange={(e) => setSelectedRack(e.target.value)}
                className="px-3 py-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 42U Cabinet Render */}
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-2">
            <div className="border-4 border-slate-700 bg-slate-950 p-2 rounded-xl space-y-1 font-mono text-[11px] shadow-2xl">
              <div className="text-center py-1 text-[10px] text-slate-400 border-b border-slate-800 uppercase tracking-widest font-bold">
                TOP OF RACK (42U CABINET - {selectedRack || 'ALL LOCATIONS'})
              </div>

              {uSlots.map((uNum) => {
                const dev = getDeviceForU(uNum);
                return (
                  <div
                    key={uNum}
                    onClick={() => dev && onSelectDevice && onSelectDevice(dev)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded border transition-all ${
                      dev
                        ? dev.status === 'Online'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 cursor-pointer'
                          : dev.status === 'Offline'
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/60 cursor-pointer'
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 cursor-pointer'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600'
                    }`}
                  >
                    <span className="font-bold w-8 text-slate-500">U{uNum}</span>

                    {dev ? (
                      <div className="flex-1 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dev.status === 'Online'
                                ? 'bg-emerald-400 animate-pulse'
                                : dev.status === 'Offline'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span className="font-bold text-slate-100">{dev.hostname}</span>
                          <span className="text-[10px] opacity-75">({dev.ip_address})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            {dev.vendor} {dev.model}
                          </span>
                          <span className="font-bold text-[10px] uppercase">{dev.status}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="flex-1 text-center italic text-[10px] text-slate-700">
                        [ Empty 1U Slot ]
                      </span>
                    )}
                  </div>
                );
              })}

              <div className="text-center py-1 text-[10px] text-slate-400 border-t border-slate-800 uppercase tracking-widest font-bold">
                BOTTOM OF RACK (POWER DISTRIBUTION UNIT)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RackDiagramModal;
