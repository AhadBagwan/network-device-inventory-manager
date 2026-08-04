import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import { 
  HiCog, 
  HiColorSwatch, 
  HiViewList, 
  HiSparkles, 
  HiCheckCircle, 
  HiRefresh 
} from 'react-icons/hi';

const Settings = () => {
  const { theme, changeTheme, THEMES } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [density, setDensity] = useState(() => {
    return localStorage.getItem('noc_table_density') || 'normal';
  });

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    return localStorage.getItem('noc_animations_enabled') !== 'false';
  });

  const handleSaveDensity = (val) => {
    setDensity(val);
    localStorage.setItem('noc_table_density', val);
    toast.success(`Table density set to ${val}.`);
  };

  const handleToggleAnimations = () => {
    const newVal = !animationsEnabled;
    setAnimationsEnabled(newVal);
    localStorage.setItem('noc_animations_enabled', newVal.toString());
    toast.success(`Animations ${newVal ? 'enabled' : 'disabled'}.`);
  };

  const handleResetPreferences = () => {
    changeTheme('dark');
    setDensity('normal');
    setAnimationsEnabled(true);
    localStorage.removeItem('noc_theme');
    localStorage.removeItem('noc_table_density');
    localStorage.removeItem('noc_animations_enabled');
    toast.success('Preferences reset to NOC default values.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Toaster position="top-right" />
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
          {/* Header */}
          <div className="border-b border-[var(--border-color)] pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
                <HiCog className="w-6 h-6 text-[var(--accent-color)]" />
                NOC System & User Preferences
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Theme customization, UI density, animation controls & preference resets
              </p>
            </div>
            <button
              onClick={handleResetPreferences}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all"
            >
              <HiRefresh className="w-4 h-4" />
              <span>Reset Preferences</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <div className="noc-card p-6 rounded-xl space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <HiColorSwatch className="w-5 h-5 text-[var(--accent-color)]" />
                Theme Selection (6 Themes Available)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      changeTheme(t.id);
                      toast.success(`Theme switched to ${t.name}.`);
                    }}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                      theme === t.id
                        ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)] shadow-xl'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
                    }`}
                    style={{ backgroundColor: t.bg }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-md"
                        style={{ backgroundColor: t.color }}
                      />
                      {theme === t.id && (
                        <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs" style={{ color: t.type === 'light' ? '#0f172a' : '#f8fafc' }}>
                        {t.name}
                      </div>
                      <div className="text-[10px] opacity-70 font-mono" style={{ color: t.type === 'light' ? '#64748b' : '#94a3b8' }}>
                        {t.type.toUpperCase()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Table Density */}
            <div className="noc-card p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <HiViewList className="w-5 h-5 text-[var(--accent-color)]" />
                Inventory Table Density
              </h3>

              <p className="text-xs text-[var(--text-muted)] font-mono">
                Control vertical row padding in the device inventory table.
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                {['compact', 'normal', 'spacious'].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleSaveDensity(d)}
                    className={`py-2.5 rounded-lg border font-mono capitalize transition-all ${
                      density === d
                        ? 'bg-[var(--accent-color)] text-slate-950 font-bold border-[var(--accent-color)]'
                        : 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Toggle */}
            <div className="noc-card p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                <HiSparkles className="w-5 h-5 text-[var(--accent-color)]" />
                Framer Motion Micro-Animations
              </h3>

              <p className="text-xs text-[var(--text-muted)] font-mono">
                Enable or disable light card animations and page transitions.
              </p>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <span className="font-bold text-xs text-[var(--text-main)]">
                  UI Animations: {animationsEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={handleToggleAnimations}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    animationsEnabled
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]'
                  }`}
                >
                  {animationsEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
