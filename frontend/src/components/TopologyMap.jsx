import React from 'react';
import { HiOutlineSignal } from 'react-icons/hi2';
import { HiServer, HiChip, HiShieldCheck, HiGlobe } from 'react-icons/hi';

const getStatusColor = (status) => {
  switch (status) {
    case 'Online':
      return '#34d399'; // Emerald-400
    case 'Offline':
      return '#f87171'; // Rose-400
    case 'Maintenance':
      return '#fbbf24'; // Amber-400
    default:
      return '#94a3b8'; // Slate-400
  }
};

const TopologyMap = ({ devices = [], onSelectDevice }) => {
  // Map devices to diagram nodes
  const nodes = devices.map((d, index) => {
    const angle = (index / (devices.length || 1)) * 2 * Math.PI;
    const radius = 180;
    const centerX = 300;
    const centerY = 240;

    // Special layout for Core assets in center
    if (d.device_type === 'Router' && d.hostname.includes('HQ')) {
      return { ...d, x: centerX, y: centerY };
    }

    return {
      ...d,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const coreNode = nodes.find((n) => n.device_type === 'Router') || nodes[0];

  return (
    <div className="noc-card p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <HiOutlineSignal className="w-5 h-5 text-[var(--accent-color)] animate-pulse" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)] font-mono">
              Live NOC Network Topology & Infrastructure Link Map
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Core Gateway, Distribution Switches & Edge Telemetry Nodes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Online
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Offline
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Maintenance
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto flex justify-center bg-[var(--bg-main)]/60 rounded-xl p-4 border border-[var(--border-color)]">
        <svg width="600" height="480" className="max-w-full">
          {/* Background Grid Lines */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="480" fill="url(#grid)" />

          {/* Connection Link Lines to Core Node */}
          {coreNode &&
            nodes.map((node) => {
              if (node.id === coreNode.id) return null;
              const color = getStatusColor(node.status);
              return (
                <g key={`link-${node.id}`}>
                  <line
                    x1={coreNode.x}
                    y1={coreNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray={node.status === 'Maintenance' ? '4,4' : 'none'}
                    opacity="0.6"
                  />
                </g>
              );
            })}

          {/* Device Nodes */}
          {nodes.map((node) => {
            const color = getStatusColor(node.status);
            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectDevice && onSelectDevice(node)}
                className="cursor-pointer group"
              >
                {/* Outer Glow Circle */}
                <circle
                  r="22"
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke={color}
                  strokeWidth="2"
                  className="transition-all group-hover:r-[26px]"
                />

                {/* Status Dot */}
                <circle
                  r="4"
                  cx="14"
                  cy="-14"
                  fill={color}
                />

                {/* Node Label */}
                <text
                  y="36"
                  textAnchor="middle"
                  fill="var(--text-main)"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.hostname}
                </text>

                <text
                  y="48"
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {node.ip_address}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TopologyMap;
