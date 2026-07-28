import React from 'react';
import { 
  HiLightningBolt, 
  HiPlusCircle, 
  HiPencilAlt, 
  HiTrash, 
  HiRefresh, 
  HiInformationCircle 
} from 'react-icons/hi';

const getActionBadge = (action) => {
  switch (action) {
    case 'Added Device':
      return { icon: HiPlusCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    case 'Edited Device':
      return { icon: HiPencilAlt, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    case 'Deleted Device':
      return { icon: HiTrash, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    case 'Ping Executed':
    case 'Status Changed':
      return { icon: HiLightningBolt, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    case 'Bulk Ping':
      return { icon: HiRefresh, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    default:
      return { icon: HiInformationCircle, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
  }
};

const formatTimeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="noc-card p-4 rounded-xl flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <HiLightningBolt className="w-4 h-4 text-[var(--accent-color)] animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            NOC Recent Activity
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          Audit Trail
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--text-muted)] font-mono">
            No recent NOC activities recorded.
          </div>
        ) : (
          activities.map((act) => {
            const badge = getActionBadge(act.action);
            const Icon = badge.icon;
            return (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-[var(--bg-main)]/60 border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className={`p-1.5 rounded-lg border shrink-0 ${badge.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[var(--text-main)] truncate">
                      {act.action}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5 font-mono">
                    {act.details}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
