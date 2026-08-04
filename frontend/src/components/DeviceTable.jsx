import React, { useState, useEffect } from 'react';
import { 
  HiLightningBolt, 
  HiPencil, 
  HiTrash, 
  HiEye, 
  HiChevronUp, 
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiServer
} from 'react-icons/hi';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Online':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </span>
      );
    case 'Offline':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Offline
        </span>
      );
    case 'Maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Maintenance
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Unknown
        </span>
      );
  }
};

const formatLastChecked = (isoString) => {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const DeviceTable = ({
  devices = [],
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  onViewDrawer,
  onEdit,
  onDelete,
  onPing,
  pingingId
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [devices.length, sortBy, sortOrder]);

  const totalPages = Math.ceil(devices.length / itemsPerPage) || 1;
  const paginatedDevices = devices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <HiChevronUp className="w-3.5 h-3.5 inline ml-1 text-[var(--accent-color)]" />
    ) : (
      <HiChevronDown className="w-3.5 h-3.5 inline ml-1 text-[var(--accent-color)]" />
    );
  };

  return (
    <div className="noc-card rounded-xl overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto min-h-[350px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--bg-main)] text-[var(--text-muted)] font-semibold uppercase tracking-wider border-b border-[var(--border-color)] sticky top-0 z-10">
              <th
                onClick={() => onSort('hostname')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-main)] transition-colors"
              >
                Hostname {renderSortIcon('hostname')}
              </th>
              <th
                onClick={() => onSort('ip_address')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-main)] transition-colors"
              >
                IP Address {renderSortIcon('ip_address')}
              </th>
              <th
                onClick={() => onSort('vendor')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-main)] transition-colors hidden md:table-cell"
              >
                Vendor {renderSortIcon('vendor')}
              </th>
              <th className="py-3 px-4 hidden lg:table-cell">Model</th>
              <th className="py-3 px-4 hidden sm:table-cell">Type</th>
              <th className="py-3 px-4 hidden xl:table-cell">Location</th>
              <th
                onClick={() => onSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-main)] transition-colors"
              >
                Status {renderSortIcon('status')}
              </th>
              <th
                onClick={() => onSort('latency')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-main)] transition-colors hidden sm:table-cell"
              >
                Latency {renderSortIcon('latency')}
              </th>
              <th
                onClick={() => onSort('last_checked')}
                className="py-3 px-4 cursor-pointer hover:text-[var(--text-main)] transition-colors hidden lg:table-cell"
              >
                Last Checked {renderSortIcon('last_checked')}
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] font-mono">
            {loading ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[var(--text-muted)] font-sans">
                  <div className="flex flex-col items-center gap-2">
                    <HiServer className="w-8 h-8 animate-pulse text-[var(--accent-color)]" />
                    <span>Loading NOC inventory telemetry...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedDevices.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[var(--text-muted)] font-sans">
                  No network devices match the active query or filter criteria.
                </td>
              </tr>
            ) : (
              paginatedDevices.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-[var(--bg-hover)]/70 transition-colors group cursor-pointer"
                  onClick={() => onViewDrawer(device)}
                >
                  <td className="py-3 px-4 font-bold text-[var(--text-main)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{device.hostname}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-semibold">{device.ip_address}</td>
                  <td className="py-3 px-4 font-sans text-[var(--text-main)] hidden md:table-cell">
                    {device.vendor}
                  </td>
                  <td className="py-3 px-4 font-sans text-[var(--text-muted)] hidden lg:table-cell">
                    {device.model}
                  </td>
                  <td className="py-3 px-4 font-sans text-[var(--text-muted)] hidden sm:table-cell">
                    <span className="noc-badge px-2 py-0.5 rounded text-[10px]">
                      {device.device_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-[var(--text-muted)] hidden xl:table-cell truncate max-w-[150px]">
                    {device.location}
                  </td>
                  <td className="py-3 px-4 font-sans">{getStatusBadge(device.status)}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    {device.latency !== null ? (
                      <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px]">
                        {device.latency.toFixed(1)} ms
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)] text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-muted)] text-[11px] hidden lg:table-cell">
                    {formatLastChecked(device.last_checked)}
                  </td>
                  <td
                    className="py-3 px-4 text-right font-sans"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPing(device.id)}
                        disabled={pingingId === device.id}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Ping Device"
                      >
                        <HiLightningBolt
                          className={`w-3.5 h-3.5 ${pingingId === device.id ? 'animate-bounce' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => onViewDrawer(device)}
                        className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-colors"
                        title="View Details"
                      >
                        <HiEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(device)}
                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                        title="Edit Device"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(device)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
                        title="Delete Device"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-main)] border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] font-mono">
        <div>
          Showing {devices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, devices.length)} of {devices.length} devices
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceTable;
