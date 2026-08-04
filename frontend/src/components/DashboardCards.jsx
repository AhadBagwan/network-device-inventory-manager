import React from 'react';
import { 
  HiServer, 
  HiCheckCircle, 
  HiXCircle, 
  HiShieldCheck,
  HiClock, 
  HiChartBar 
} from 'react-icons/hi';

const DashboardCards = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Assets',
      value: stats?.total_devices ?? 0,
      subtext: 'Cataloged Hardware Nodes',
      icon: HiServer,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30',
      iconBg: 'bg-cyan-500/20'
    },
    {
      title: 'Online Devices',
      value: stats?.online_devices ?? 0,
      subtext: `${stats?.online_percentage ?? 100}% SLA Availability`,
      icon: HiCheckCircle,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20'
    },
    {
      title: 'Offline Devices',
      value: stats?.offline_devices ?? 0,
      subtext: 'Unresponsive IP Targets',
      icon: HiXCircle,
      color: 'text-rose-400',
      bg: 'from-rose-500/10 to-rose-500/5 border-rose-500/30',
      iconBg: 'bg-rose-500/20'
    },
    {
      title: 'Maintenance Mode',
      value: stats?.maintenance_devices ?? 0,
      subtext: 'Scheduled Window Assets',
      icon: HiShieldCheck,
      color: 'text-amber-400',
      bg: 'from-amber-500/10 to-amber-500/5 border-amber-500/30',
      iconBg: 'bg-amber-500/20'
    },
    {
      title: 'Average Latency',
      value: stats?.avg_latency ? `${stats.avg_latency} ms` : '0.0 ms',
      subtext: 'ICMP Response Time',
      icon: HiClock,
      color: 'text-purple-400',
      bg: 'from-purple-500/10 to-purple-500/5 border-purple-500/30',
      iconBg: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`noc-card p-4 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-between transition-all hover:scale-[1.02]`}
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)] block">
                {card.title}
              </span>
              <div className={`text-2xl font-extrabold font-mono ${card.color}`}>
                {loading ? '...' : card.value}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                {card.subtext}
              </span>
            </div>
            <div className={`p-3 rounded-xl ${card.iconBg} ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
