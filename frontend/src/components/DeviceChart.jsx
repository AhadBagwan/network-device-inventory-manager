import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TYPE_COLORS = [
  '#06b6d4', // Router
  '#6366f1', // Switch
  '#f59e0b', // Firewall
  '#a855f7', // Server
  '#10b981', // Access Point
  '#ec4899', // Load Balancer
  '#3b82f6', // Wireless Controller
];

const DeviceChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { device_type: 'Router', count: 3 },
    { device_type: 'Switch', count: 4 },
    { device_type: 'Firewall', count: 2 },
    { device_type: 'Server', count: 3 },
    { device_type: 'Access Point', count: 1 },
    { device_type: 'Load Balancer', count: 1 },
    { device_type: 'Wireless Controller', count: 1 },
  ];

  return (
    <div className="noc-card p-4 rounded-xl flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
          Device Type Breakdown
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          Infrastructure Roles
        </span>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <XAxis
              dataKey="device_type"
              stroke="var(--text-muted)"
              fontSize={10}
              interval={0}
              angle={-25}
              textAnchor="end"
              tickLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={10}
              allowDecimals={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '0.5rem',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: '600',
              }}
              formatter={(value) => [`${value} Devices`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeviceChart;
