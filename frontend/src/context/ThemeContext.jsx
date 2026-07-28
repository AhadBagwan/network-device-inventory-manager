import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'dark', name: 'Dark NOC (Default)', color: '#38bdf8', bg: '#0b0f19', type: 'dark' },
  { id: 'blue', name: 'Professional Blue', color: '#00d2ff', bg: '#0a1128', type: 'dark' },
  { id: 'cyber', name: 'Cyber Green', color: '#22c55e', bg: '#05140b', type: 'dark' },
  { id: 'purple', name: 'Deep Purple', color: '#a855f7', bg: '#120b24', type: 'dark' },
  { id: 'crimson', name: 'Crimson Alert', color: '#f43f5e', bg: '#170509', type: 'dark' },
  { id: 'solar', name: 'Solar Light', color: '#0284c7', bg: '#f8fafc', type: 'light' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('noc_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('noc_theme', theme);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
