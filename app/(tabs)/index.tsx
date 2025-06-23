import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Phone, Mail, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { ImageZoom } from '@/components/ImageZoom';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const getLocalizedWelcomeTitle = () => {
    switch (i18n.language) {
      case 'fr':
        return 'Bienvenue\nchez East At West';
      case 'nl':
        return 'Welkom\nbij East At West';
      default:
        return 'Welcome\nto East At West';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flex: 1,
    },
    heroSection: {
      height: 300,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    heroTitle: {
      fontSize: 30,
      fontFamily: theme.fonts.headingBoldItalic,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      lineHeight: 40,
    },
   
    contentSection: {
      padding: theme.spacing.lg,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: theme.fonts.bodyItalic,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      
    },
    sectionTitle: {
      fontSize: 22,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    infoIcon: {
      marginRight: theme.spacing.md,
    },
    infoText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
      flex: 1,
    },
    hoursGrid: {
      gap: theme.spacing.xs,
      
    },
    hourRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.xs,
    },
    dayText: {
      fontSize: 14,
      fontFamily: theme.fonts.bodyMedium,
      color: theme.colors.text,
    },
    timeText: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    footer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerText: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const contactInfo = [
    {
      icon: <MapPin size={20} color={theme.colors.primary} />,
      text: t('home.contact.address'),
    },
    {
      icon: <Phone size={20} color={theme.colors.primary} />,
      text: t('home.contact.phone'),
    },
    {
      icon: <Mail size={20} color={theme.colors.primary} />,
      text: t('home.contact.email'),
    },
  ];

  const hours = [
    { day: t('home.hours.monday'), time: '11:30 AM - 10:00 PM' },
    { day: t('home.hours.tuesday'), time: '11:30 AM - 10:00 PM' },
    { day: t('home.hours.wednesday'), time: '11:30 AM - 10:00 PM' },
    { day: t('home.hours.thursday'), time: '11:30 AM - 10:00 PM' },
    { day: t('home.hours.friday'), time: '11:30 AM - 11:00 PM' },
    { day: t('home.hours.saturday'), time: '11:30 AM - 11:00 PM' },
    { day: t('home.hours.sunday'), time: '12:00 PM - 10:00 PM' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header showSettings />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <ImageZoom
            source={require('@/assets/images/restaurant.webp')}
            style={styles.heroImage}
            alt="EastAtWest Restaurant Interior"
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{getLocalizedWelcomeTitle()}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.description}>{t('home.description')}</Text>

          <Text style={styles.sectionTitle}>{t('home.openingHours')}</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.hoursGrid}>
                {hours.map((hour, index) => (
                  <View key={index} style={styles.hourRow}>
                    <Text style={styles.dayText}>{hour.day.split(':')[0]}</Text>
                    <Text style={styles.timeText}>{hour.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            {contactInfo.map((info, index) => (
              <View key={index} style={styles.infoRow}>
                <View style={styles.infoIcon}>{info.icon}</View>
                <Text style={styles.infoText}>{info.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 EastAtWest Restaurant. All rights reserved. Design by <Text style={styles.footerText}>Mbagnick Gaye</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}