import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  primary: '#3498db',
  text: '#1a1a2e',
  subText: '#666666',
  background: '#f8f9fa',
  card: '#ffffff',
  border: '#e0e0e0',
  accent: '#3498db',
  highlight: '#d4f5d4',
  switchTrackColor: { true: '#81b0ff', false: '#f4f3f4' },
  switchThumbColor: { true: '#f5dd4b', false: '#f4f3f4' },
  secondary: '#2ecc71',
};

export const darkTheme = {
  primary: '#60a5fa',
  text: '#e4e6eb',
  subText: '#b0b3b8',
  background: '#18191a',
  card: '#242526',
  border: '#3a3b3c',
  accent: '#4895ef',
  highlight: '#004d40',
  switchTrackColor: { true: '#767577', false: '#39393a' },
  switchThumbColor: { true: '#f5dd4b', false: '#f4f3f4' },
  secondary: '#2ecc71',
};

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: typeof lightTheme;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  colors: lightTheme,
  currentTheme: 'light'
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const systemColorScheme = useColorScheme() as 'light' | 'dark';
  const [theme, setTheme] = useState<ThemeType>('system');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Update current theme when theme or system preference changes
  useEffect(() => {
    if (theme === 'system') {
      setCurrentTheme(systemColorScheme || 'light');
    } else {
      setCurrentTheme(theme === 'dark' ? 'dark' : 'light');
    }
  }, [theme, systemColorScheme]);

  // Save theme preference
  const changeTheme = async (newTheme: ThemeType) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  // Determine which color scheme to use
  const colors = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
      <ThemeContext.Provider value={{ theme, setTheme: changeTheme, colors, currentTheme }}>
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);