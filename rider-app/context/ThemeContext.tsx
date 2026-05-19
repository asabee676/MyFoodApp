import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme, Platform } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: typeof ThemeColors.light;
}

export const ThemeColors = {
  light: {
    primary: '#E53935',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    card: '#FFFFFF',
    error: '#D32F2F',
    success: '#2E7D32',
    white: '#FFFFFF',
    black: '#000000',
    tabBar: '#FFFFFF',
    tabIconDefault: '#8E8E93',
    icon: '#666666',
    inputBg: '#F0F2F5',
    mapStyle: [] // default light map
  },
  dark: {
    primary: '#E53935',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#2D2D2D',
    card: '#1E1E1E',
    error: '#CF6679',
    success: '#81C784',
    white: '#FFFFFF',
    black: '#000000',
    tabBar: '#1E1E1E',
    tabIconDefault: '#8E8E93',
    icon: '#E0E0E0',
    inputBg: '#1E1E1E',
    mapStyle: [
      { elementType: 'geometry', stylers: [{ color: '#161616' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#161616' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#747474' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#252525' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
    ]
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = _useColorScheme();
  const [theme, _setTheme] = useState<ThemeMode>('dark'); // Default dark mode

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const savedTheme = localStorage.getItem('rider-theme');
        if (savedTheme) {
          _setTheme(savedTheme as ThemeMode);
        }
      } catch (e) {}
    }
  }, []);

  const setTheme = (mode: ThemeMode) => {
    _setTheme(mode);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem('rider-theme', mode);
      } catch (e) {}
    }
  };

  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';
  const colors = isDark ? ThemeColors.dark : ThemeColors.light;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
