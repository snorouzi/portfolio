import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, getInitialTheme, applyTheme } from '../theme';

export const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setThemeValue = useCallback((nextTheme) => {
    setTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // localStorage unavailable; theme still applied for this session
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY) !== null) {
          return;
        }
      } catch {
        // Ignore storage errors; keep current theme
      }
      setThemeValue(event.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [setThemeValue]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
}
