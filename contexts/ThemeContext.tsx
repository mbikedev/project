import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
  fonts: {
    heading: string;
    headingItalic: string;
    headingMedium: string;
    headingSemiBold: string;
    headingBold: string;
    headingBoldItalic: string;
    body: string;
    bodyItalic: string;
    bodyMedium: string;
    bodySemiBold: string;
    bodyBold: string;
  };
}

const createShadows = (isDark: boolean = false) => {
  const opacity = isDark ? 0.8 : 0.3;
  
  if (Platform.OS === 'web') {
    return {
      sm: {
        boxShadow: `0px 1px 2px rgba(0, 0, 0, ${opacity * 0.2})`,
        elevation: 1,
      },
      md: {
        boxShadow: `0px 2px 4px rgba(0, 0, 0, ${opacity * 0.3})`,
        elevation: 2,
      },
      lg: {
        boxShadow: `0px 4px 8px rgba(0, 0, 0, ${opacity * 0.4})`,
        elevation: 4,
      },
    };
  } else {
    return {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: opacity * 0.2,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: opacity * 0.3,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: opacity * 0.4,
        shadowRadius: 8,
        elevation: 4,
      },
    };
  }
};

const lightTheme: Theme = {
  colors: {
    primary: '#8B4513',
    primaryLight: '#CD853F',
    primaryDark: '#654321',
    secondary: '#DAA520',
    accent: '#DEB887',
    background: '#FFF8DC',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5DC',
    text: '#2F1B14',
    textSecondary: '#8B4513',
    border: '#D2B48C',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: createShadows(false),
  fonts: {
    heading: 'PlayfairDisplay-Regular',
    headingItalic: 'PlayfairDisplay-Italic',
    headingMedium: 'PlayfairDisplay-Medium',
    headingSemiBold: 'PlayfairDisplay-SemiBold',
    headingBold: 'PlayfairDisplay-Bold',
    headingBoldItalic: 'PlayfairDisplay-BoldItalic',
    body: 'Inter-Regular',
    bodyItalic: 'Inter-Italic',
    bodyMedium: 'Inter-Medium',
    bodySemiBold: 'Inter-SemiBold',
    bodyBold: 'Inter-Bold',
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#CD853F',
    primaryLight: '#DEB887',
    primaryDark: '#8B4513',
    secondary: '#F4A460',
    accent: '#D2B48C',
    background: '#1A1611',
    surface: '#2C251E',
    surfaceVariant: '#3D342A',
    text: '#F5F1E8',
    textSecondary: '#D2B48C',
    border: '#4A3F32',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  shadows: createShadows(true),
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
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