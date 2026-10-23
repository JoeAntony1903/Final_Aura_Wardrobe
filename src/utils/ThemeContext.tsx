import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types';
import { APP_THEMES } from './theme';

interface ThemeContextType {
  theme: AppTheme;
  themeId: string;
  setThemeId: (id: string) => void;
  accent: string;
  accentRgb: string;
  accentText: string;
  accentHover: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  initialThemeId?: string;
  children: React.ReactNode;
}> = ({ initialThemeId = 'midnight-chic', children }) => {
  const [themeId, setThemeId] = useState<string>(() => {
    const saved = localStorage.getItem('aura_theme_id');
    return saved || initialThemeId;
  });

  const theme = APP_THEMES.find((t) => t.id === themeId) || APP_THEMES[0];

  useEffect(() => {
    localStorage.setItem('aura_theme_id', themeId);

    // Apply CSS variables to root document
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-accent-rgb', theme.accentRgb || '212, 175, 55');
    root.style.setProperty('--theme-accent-text', theme.accentText || '#000000');
    root.style.setProperty('--theme-accent-hover', theme.accentHover || theme.accent);
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId,
        setThemeId,
        accent: theme.accent,
        accentRgb: theme.accentRgb || '212, 175, 55',
        accentText: theme.accentText || '#000000',
        accentHover: theme.accentHover || theme.accent,
      }}
    >
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
