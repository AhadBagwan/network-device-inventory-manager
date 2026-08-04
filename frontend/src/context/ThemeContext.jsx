import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'dark', name: 'Dark NOC', color: '#38bdf8', bg: '#0b0f19', type: 'dark' },
  { id: 'cyber-blue', name: 'Cyber Blue', color: '#00d2ff', bg: '#060d1f', type: 'dark' },
  { id: 'cyber-green', name: 'Cyber Green', color: '#22c55e', bg: '#031209', type: 'dark' },
  { id: 'purple', name: 'Purple NOC', color: '#a855f7', bg: '#0f091f', type: 'dark' },
  { id: 'slate', name: 'Slate NOC', color: '#f59e0b', bg: '#0f172a', type: 'dark' },
  { id: 'light', name: 'Light Mode', color: '#0284c7', bg: '#f1f5f9', type: 'light' },
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
