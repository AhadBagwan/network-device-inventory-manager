import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { HiColorSwatch, HiCheck } from 'react-icons/hi';

const ThemeSwitcher = () => {
  const { theme, changeTheme, THEMES } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-main)] transition-all shadow-sm"
        title="Change UI Theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
          style={{ backgroundColor: currentThemeObj.color }}
        />
        <span className="hidden sm:inline font-mono">{currentThemeObj.name}</span>
        <HiColorSwatch className="w-4 h-4 text-[var(--text-muted)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] mb-1">
            Select Color Scheme
          </div>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                changeTheme(t.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                theme === t.id
                  ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold'
                  : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: t.color }}
                />
                <span>{t.name}</span>
              </div>
              {theme === t.id && <HiCheck className="w-4 h-4 text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
