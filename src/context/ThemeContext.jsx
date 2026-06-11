import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'auto') setIsDark(mediaQuery.matches);
    };

    if (themeMode === 'auto') {
      setIsDark(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
    } else {
      setIsDark(themeMode === 'dark');
    }
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    if (themeMode === 'dark') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('auto');
    else setThemeMode('dark');
  };

  const value = useMemo(() => ({ isDark, themeMode, toggleTheme }), [isDark, themeMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);