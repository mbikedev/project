import { Tabs } from 'expo-router';
import { Chrome as Home, Menu, Calendar, ShoppingBag, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingTop: 8,
          paddingBottom: 8,
          ...(Platform.OS === 'web' && { 
            // Remove deprecated pointerEvents style
          }),
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.bodySemiBold,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t('nav.menu'),
          tabBarIcon: ({ size, color }) => (
            <Menu size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: t('nav.reservations'),
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="takeaway"
        options={{
          title: t('nav.takeaway'),
          tabBarIcon: ({ size, color }) => (
            <ShoppingBag size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}