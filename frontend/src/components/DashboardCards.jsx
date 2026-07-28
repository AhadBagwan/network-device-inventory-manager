import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiServer, 
  HiShieldCheck, 
  HiCheckCircle, 
  HiXCircle, 
  HiClock, 
  HiChartBar, 
  HiChip,
  HiCollection
} from 'react-icons/hi';
import { TbRouter } from 'react-icons/tb';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Devices',
      value: stats?.total_devices ?? 0,
      icon: HiCollection,
      color: 'text-sky-400',
      bg: 'from-sky-500/10 to-sky-500/5 border-sky-500/30',
      sub: 'Managed Assets'
    },
    {
      title: 'Online Devices',
      value: stats?.online_devices ?? 0,
      icon: HiCheckCircle,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
      sub: 'Operational'
    },
    {
      title: 'Offline Devices',
      value: stats?.offline_devices ?? 0,
      icon: HiXCircle,
      color: 'text-rose-400',
      bg: 'from-rose-500/10 to-rose-500/5 border-rose-500/30',
      sub: 'Attention Needed'
    },
    {
      title: 'Routers',
      value: stats?.routers ?? 0,
      icon: TbRouter,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30',
      sub: 'WAN Edge'
    },
    {
      title: 'Switches',
      value: stats?.switches ?? 0,
      icon: HiChip,
      color: 'text-indigo-400',
      bg: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/30',
      sub: 'LAN Core & Access'
    },
    {
      title: 'Firewalls',
      value: stats?.firewalls ?? 0,
      icon: HiShieldCheck,
      color: 'text-amber-400',
      bg: 'from-amber-500/10 to-amber-500/5 border-amber-500/30',
      sub: 'Perimeter Security'
    },
    {
      title: 'Servers',
      value: stats?.servers ?? 0,
      icon: HiServer,
      color: 'text-purple-400',
      bg: 'from-purple-500/10 to-purple-500/5 border-purple-500/30',
      sub: 'Host Systems'
    },
    {
      title: 'Avg Latency',
      value: stats?.avg_latency ? `${stats.avg_latency} ms` : '0.00 ms',
      icon: HiClock,
      color: 'text-teal-400',
      bg: 'from-teal-500/10 to-teal-500/5 border-teal-500/30',
      sub: 'ICMP Response'
    },
    {
      title: 'Availability',
      value: `${stats?.online_percentage ?? 0}%`,
      icon: HiChartBar,
      color: 'text-blue-400',
      bg: 'from-blue-500/10 to-blue-500/5 border-blue-500/30',
      sub: 'SLA Target 99.9%'
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            className={`noc-card p-3 rounded-xl bg-gradient-to-b ${card.bg} transition-all hover:scale-[1.02] flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] truncate">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
            </div>

            <div className="my-1">
              <span className="text-lg sm:text-xl font-bold font-mono tracking-tight text-[var(--text-main)]">
                {card.value}
              </span>
            </div>

            <div className="text-[10px] text-[var(--text-muted)] truncate font-mono">
              {card.sub}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
