import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    success: string;
    warning: string;
    danger: string;
  };
};

const darkTheme = {
  background: '#0F0F1A',
  card: '#1A1A2E',
  text: '#FFFFFF',
  border: '#2A2A3C',
  primary: '#4361EE',
  secondary: '#3F37C9',
  accent: '#F72585',
  muted: '#6C757D',
  success: '#4CC9F0',
  warning: '#F8961E',
  danger: '#F94144',
};

const lightTheme = {
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  border: '#DEE2E6',
  primary: '#4361EE',
  secondary: '#3F37C9',
  accent: '#F72585',
  muted: '#6C757D',
  success: '#4CC9F0',
  warning: '#F8961E',
  danger: '#F94144',
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  colors: darkTheme,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const value = {
    isDark: true, // Force dark theme for this app
    colors: darkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};