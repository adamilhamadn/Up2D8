import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { Colors, AccentColors, AccentColorName } from './colors';
import { getStorageItem, setStorageItem } from '../lib/storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  colorScheme: 'dark' | 'light';
  themeMode: ThemeMode;
  colors: typeof Colors['dark'] | typeof Colors['light'];
  accent: string;
  accentName: AccentColorName;
  setAccent: (name: AccentColorName) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme: systemScheme, setColorScheme } = useColorScheme();
  
  const [accentName, setAccentName] = useState<AccentColorName>('graphite');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    getStorageItem('up2d8_accent_color').then((stored) => {
      if (stored && stored in AccentColors) {
        setAccentName(stored as AccentColorName);
      }
    });
    getStorageItem('up2d8_theme_mode').then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored as ThemeMode);
      }
    });
  }, []);

  const setAccent = (name: AccentColorName) => {
    setAccentName(name);
    setStorageItem('up2d8_accent_color', name);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setStorageItem('up2d8_theme_mode', mode);
  };

  const resolvedSystemScheme = systemScheme === 'dark' || systemScheme === 'light' ? systemScheme : 'dark';
  const colorScheme = themeMode === 'system' ? resolvedSystemScheme : themeMode;

  useEffect(() => {
    setColorScheme(themeMode); // Let NativeWind handle 'system' | 'light' | 'dark' mapping via CSS variables
  }, [themeMode, setColorScheme]);

  return (
    <ThemeContext.Provider 
      value={{
        colorScheme,
        themeMode,
        colors: Colors[colorScheme],
        accent: AccentColors[accentName],
        accentName,
        setAccent,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
