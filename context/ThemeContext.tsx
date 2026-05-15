import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    text: '#333333',
    textSecondary: '#777777',
    border: '#EEEEEE',
    card: '#FFFFFF',
    error: '#B00020',
    success: '#4CAF50',
    white: '#FFFFFF',
    black: '#000000',
    tabBar: '#FFFFFF',
    tabIconDefault: '#999999',
  },
  dark: {
    primary: '#EF5350',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#EEEEEE',
    textSecondary: '#AAAAAA',
    border: '#333333',
    card: '#1E1E1E',
    error: '#CF6679',
    success: '#81C784',
    white: '#FFFFFF',
    black: '#000000',
    tabBar: '#1E1E1E',
    tabIconDefault: '#666666',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = _useColorScheme();
  const [theme, _setTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('user-theme');
      if (savedTheme) {
        _setTheme(savedTheme as ThemeMode);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (mode: ThemeMode) => {
    _setTheme(mode);
    await AsyncStorage.setItem('user-theme', mode);
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
