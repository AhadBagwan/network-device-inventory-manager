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

  const darkThemes = THEMES.filter((t) => t.type === 'dark');
  const lightThemes = THEMES.filter((t) => t.type === 'light');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Icon Box Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] transition-all shadow-sm flex items-center justify-center group"
        title={`Current Theme: ${currentThemeObj.name} (Click to switch)`}
        aria-label="Theme Selector"
      >
        <div className="relative flex items-center justify-center">
          <HiColorSwatch className="w-5 h-5 text-[var(--accent-color)] group-hover:scale-110 transition-transform" />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900 shadow-md"
            style={{ backgroundColor: currentThemeObj.color }}
          />
        </div>
      </button>

      {/* Theme Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2 max-h-96 overflow-y-auto">
          {/* Dark Themes Header */}
          <div>
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] mb-1">
              🌙 NOC Dark Themes
            </div>
            {darkThemes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    changeTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left transition-all ${
                    isSelected
                      ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold border border-[var(--border-color)] shadow-sm'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </div>
                  {isSelected && <HiCheck className="w-4 h-4 text-emerald-400 font-bold" />}
                </button>
              );
            })}
          </div>

          {/* Light Themes Header */}
          <div>
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] mb-1 pt-1">
              ☀️ NOC Light Themes
            </div>
            {lightThemes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    changeTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-left transition-all ${
                    isSelected
                      ? 'bg-[var(--bg-hover)] text-[var(--accent-color)] font-bold border border-[var(--border-color)] shadow-sm'
                      : 'text-[var(--text-main)] hover:bg-[var(--bg-hover)]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{t.name}</span>
                  </div>
                  {isSelected && <HiCheck className="w-4 h-4 text-emerald-400 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
