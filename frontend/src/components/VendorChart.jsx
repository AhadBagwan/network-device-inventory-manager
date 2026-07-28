import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const VENDOR_COLORS = [
  '#0284c7', // Cisco - Deep Cyan/Blue
  '#f97316', // Fortinet - Orange
  '#10b981', // Juniper - Green
  '#6366f1', // Dell - Indigo
  '#a855f7', // HP / Aruba - Purple
  '#06b6d4', // Ubiquiti - Cyan
  '#ef4444', // Palo Alto - Red
  '#ec4899', // VMware - Pink
  '#eab308', // F5 - Yellow
  '#64748b', // Other - Slate
];

const VendorChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { vendor: 'Cisco', count: 5 },
    { vendor: 'Fortinet', count: 2 },
    { vendor: 'Juniper', count: 1 },
    { vendor: 'Dell', count: 2 },
    { vendor: 'HP', count: 1 },
    { vendor: 'Palo Alto', count: 1 },
    { vendor: 'Ubiquiti', count: 1 },
    { vendor: 'VMware', count: 1 },
    { vendor: 'F5 Networks', count: 1 },
  ];

  return (
    <div className="noc-card p-4 rounded-xl flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
          Vendor Distribution
        </h3>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          Network Ecosystem
        </span>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
              nameKey="vendor"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={VENDOR_COLORS[index % VENDOR_COLORS.length]}
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '0.5rem',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: '600',
              }}
              formatter={(value, name) => [`${value} Devices`, name]}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VendorChart;
