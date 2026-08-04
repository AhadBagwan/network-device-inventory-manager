import React from 'react';
import { HiFilter, HiRefresh, HiTag, HiFolder } from 'react-icons/hi';

const Filters = ({
  vendorFilter,
  onVendorChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  locationFilter,
  onLocationChange,
  tagFilter,
  onTagChange,
  groupFilter,
  onGroupChange,
  vendors = [],
  types = [],
  locations = [],
  tags = [],
  groups = [],
  onReset
}) => {
  const hasActiveFilters =
    vendorFilter || statusFilter || typeFilter || locationFilter || tagFilter || groupFilter;

  return (
    <div className="noc-card p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono font-bold">
          <HiFilter className="w-4 h-4 text-[var(--accent-color)]" />
          <span>Filter:</span>
        </div>

        {/* Vendor Filter */}
        <select
          value={vendorFilter}
          onChange={(e) => onVendorChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
        >
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Online">🟢 Online</option>
          <option value="Offline">🔴 Offline</option>
          <option value="Maintenance">🟡 Maintenance</option>
          <option value="Unknown">⚪ Unknown</option>
        </select>

        {/* Device Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {/* Tags Filter */}
        {tags && tags.length > 0 && (
          <select
            value={tagFilter}
            onChange={(e) => onTagChange && onTagChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-cyan-400 font-mono focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        )}

        {/* Groups Filter */}
        {groups && groups.length > 0 && (
          <select
            value={groupFilter}
            onChange={(e) => onGroupChange && onGroupChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-mono font-semibold transition-colors"
        >
          <HiRefresh className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default Filters;
