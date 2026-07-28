import React from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="relative flex-1 min-w-[200px] max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
        <HiSearch className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Hostname, IP, Vendor, Model, Location, OS..."
        className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all font-mono"
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          <HiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
