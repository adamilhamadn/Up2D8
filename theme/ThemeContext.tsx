import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Colors, AccentColors, AccentColorName } from './colors';

interface ThemeContextType {
  colorScheme: 'dark' | 'light';
  colors: typeof Colors['dark'] | typeof Colors['light'];
  accent: string;
  accentName: AccentColorName;
  setAccent: (name: AccentColorName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme() ?? 'dark';
  const colorScheme = scheme === 'dark' ? 'dark' : 'light';
  
  const [accentName, setAccentName] = useState<AccentColorName>('graphite');

  useEffect(() => {
    SecureStore.getItemAsync('up2d8_accent_color').then((stored) => {
      if (stored && stored in AccentColors) {
        setAccentName(stored as AccentColorName);
      }
    });
  }, []);

  const setAccent = (name: AccentColorName) => {
    setAccentName(name);
    SecureStore.setItemAsync('up2d8_accent_color', name);
  };

  return (
    <ThemeContext.Provider 
      value={{
        colorScheme,
        colors: Colors[colorScheme],
        accent: AccentColors[accentName],
        accentName,
        setAccent,
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
