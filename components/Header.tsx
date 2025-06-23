import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Settings, Sun, Moon, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
  onSettingsPress?: () => void;
}

export function Header({ title, showSettings = false, onSettingsPress }: HeaderProps) {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { changeLanguage, currentLanguage } = useI18n();
  const { t } = useTranslation();

  const toggleTheme = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={20} color={theme.colors.text} />;
      case 'dark':
        return <Moon size={20} color={theme.colors.text} />;
      default:
        return <Smartphone size={20} color={theme.colors.text} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: title ? 'space-between' : 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 20,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
      justifyContent: title ? 'flex-end' : 'center',
    },
    iconButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    languageSelectorContainer: {
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image 
          source={require('@/assets/images/logo-trans.webp')}
          style={styles.logo}
        />
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      
      <View style={styles.rightContainer}>
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector />
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
          {getThemeIcon()}
        </TouchableOpacity>
        {showSettings && (
          <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
            <Settings size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}