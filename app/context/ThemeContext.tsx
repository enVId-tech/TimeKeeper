import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subText: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    success: string;
    switchTrackColor: {
      false: string;
      true: string;
    };
    switchThumbColor: {
      false: string;
      true: string;
    };
  };
}

const defaultColors = {
  light: {
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#212529',
    subText: '#6c757d',
    border: '#dee2e6',
    primary: '#007bff',
    secondary: '#6c757d',
    accent: '#e6f2ff',
    danger: '#dc3545',
    success: '#28a745',
    switchTrackColor: {
      false: '#767577',
      true: '#b3d9ff'
    },
    switchThumbColor: {
      false: '#f4f3f4',
      true: '#007bff'
    }
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#e9ecef',
    subText: '#adb5bd',
    border: '#343a40',
    primary: '#0d6efd',
    secondary: '#adb5bd',
    accent: '#0d417a',
    danger: '#dc3545',
    success: '#28a745',
    switchTrackColor: {
      false: '#3a3a3c',
      true: '#0d417a'
    },
    switchThumbColor: {
      false: '#767577',
      true: '#0d6efd'
    }
  }
};

export interface PeriodData {
    period: string;
    start: string;
    end: string;
    duration: number;
}

export interface BellScheduleType {
    [scheduleName: string]: PeriodData[];
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  currentTheme: 'light',
  setTheme: () => {},
  colors: defaultColors.light
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const systemColorScheme = useColorScheme() || 'light';
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(systemColorScheme as 'light' | 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_preference');
        if (savedTheme !== null) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Update current theme when theme preference or system theme changes
  useEffect(() => {
    if (theme === 'system') {
      setCurrentTheme(systemColorScheme as 'light' | 'dark');
    } else {
      setCurrentTheme(theme as 'light' | 'dark');
    }
  }, [theme, systemColorScheme]);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('@theme_preference', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setTheme,
        colors: defaultColors[currentTheme]
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);