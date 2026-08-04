import React from 'react';
import { 
  HiBell, 
  HiExclamationCircle, 
  HiInformationCircle, 
  HiShieldExclamation, 
  HiTrash 
} from 'react-icons/hi';

const getSeverityBadge = (severity) => {
  switch (severity) {
    case 'critical':
      return (
        <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <HiShieldExclamation className="w-4 h-4" />
        </span>
      );
    case 'warning':
      return (
        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <HiExclamationCircle className="w-4 h-4" />
        </span>
      );
    default:
      return (
        <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <HiInformationCircle className="w-4 h-4" />
        </span>
      );
  }
};

const formatTimeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

const RecentAlerts = ({ notifications = [], onClearNotifications }) => {
  return (
    <div className="noc-card p-5 rounded-xl space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <HiBell className="w-5 h-5 text-[var(--accent-color)]" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
            NOC Alerts & Event Notifications
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {notifications.length} Alerts
          </span>
        </div>

        {notifications.length > 0 && onClearNotifications && (
          <button
            onClick={onClearNotifications}
            className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-rose-400 transition-colors"
          >
            <HiTrash className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-[var(--text-muted)] text-xs font-mono">
            No active NOC alerts. All telemetry monitors reporting normal.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] transition-colors hover:bg-[var(--bg-hover)]"
            >
              {getSeverityBadge(notif.severity)}
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--text-main)]">{notif.title}</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {formatTimeAgo(notif.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-mono leading-tight">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAlerts;
