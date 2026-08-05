import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  // Dark Themes
  { id: 'dark', name: 'Dark NOC', color: '#38bdf8', bg: '#0b0f19', type: 'dark' },
  { id: 'cyber-blue', name: 'Cyber Blue', color: '#00d2ff', bg: '#060d1f', type: 'dark' },
  { id: 'cyber-green', name: 'Cyber Green', color: '#22c55e', bg: '#031209', type: 'dark' },
  { id: 'purple', name: 'Purple NOC', color: '#a855f7', bg: '#0f091f', type: 'dark' },
  { id: 'slate', name: 'Slate NOC', color: '#f59e0b', bg: '#0f172a', type: 'dark' },
  
  // Light Themes
  { id: 'light', name: 'Light Corporate', color: '#0284c7', bg: '#f8fafc', type: 'light' },
  { id: 'light-mint', name: 'Light Mint', color: '#16a34a', bg: '#f0fdf4', type: 'light' },
  { id: 'light-sunset', name: 'Light Sunset', color: '#ea580c', bg: '#fff7ed', type: 'light' },
  { id: 'light-indigo', name: 'Light Indigo', color: '#4f46e5', bg: '#f5f3ff', type: 'light' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('noc_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('noc_theme', theme);
    
    // Apply theme class to body and documentElement
    const themeClass = `theme-${theme}`;
    
    THEMES.forEach((t) => {
      document.documentElement.classList.remove(`theme-${t.id}`);
      document.body.classList.remove(`theme-${t.id}`);
    });

    document.documentElement.classList.add(themeClass);
    document.body.classList.add(themeClass);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
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
