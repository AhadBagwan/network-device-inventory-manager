import React from 'react';
import { HiExclamation, HiX } from 'react-icons/hi';

const DeleteModal = ({ isOpen, onClose, onConfirm, device, isDeleting }) => {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
              <HiExclamation className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-bold text-[var(--text-main)]">
                Delete Device Asset?
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                Are you sure you want to remove <span className="font-bold text-rose-400">{device.hostname}</span> ({device.ip_address}) from inventory?
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-2 italic">
                This action will update NOC logs and permanently remove device telemetry history.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)] text-xs">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(device.id)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Asset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
