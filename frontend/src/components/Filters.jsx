import React from 'react';
import { HiFilter, HiXCircle } from 'react-icons/hi';

const VENDORS = ['Cisco', 'Juniper', 'Fortinet', 'MikroTik', 'Dell', 'HP', 'Aruba', 'Ubiquiti', 'Palo Alto', 'VMware', 'F5 Networks', 'Other'];
const STATUSES = ['Online', 'Offline', 'Unknown'];
const TYPES = ['Router', 'Switch', 'Firewall', 'Server', 'Access Point', 'Load Balancer', 'Wireless Controller'];
const DEFAULT_LOCATIONS = ['Headquarters', 'Data Center', 'Server Room', 'Branch Office East', 'Headquarters - Floor 1'];

const Filters = ({
  vendor,
  setVendor,
  status,
  setStatus,
  type,
  setType,
  location,
  setLocation,
  availableLocations = [],
  onReset
}) => {
  const hasActiveFilters = vendor || status || type || location;
  const locationsToDisplay = availableLocations.length > 0 ? availableLocations : DEFAULT_LOCATIONS;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] pr-1 hidden sm:flex">
        <HiFilter className="w-4 h-4 text-[var(--accent-color)]" />
        <span>Filters:</span>
      </div>

      {/* Vendor Filter */}
      <select
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-sans"
      >
        <option value="">All Vendors</option>
        {VENDORS.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-sans"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Device Type Filter */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-sans"
      >
        <option value="">All Types</option>
        {TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* Location Filter */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-sans"
      >
        <option value="">All Locations</option>
        {locationsToDisplay.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-medium transition-all"
        >
          <HiXCircle className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};

export default Filters;
