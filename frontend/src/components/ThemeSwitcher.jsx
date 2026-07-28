import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { HiOutlineColorSwatch, HiCheck } from 'react-icons/hi';

const ThemeSwitcher = () => {
  const { theme, changeTheme, THEMES } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-sm font-medium transition-colors"
        title="Switch NOC Theme"
      >
        <HiOutlineColorSwatch className="w-4 h-4 text-[var(--accent-color)]" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-semibold px-2 py-1 text-[var(--text-muted)] uppercase tracking-wider">
            NOC Themes
          </div>
          <div className="space-y-1 mt-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  changeTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  theme === t.id
                    ? 'bg-[var(--bg-hover)] text-[var(--text-main)] font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.name}</span>
                </div>
                {theme === t.id && <HiCheck className="w-4 h-4 text-[var(--accent-color)]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
