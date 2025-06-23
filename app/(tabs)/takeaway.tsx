import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Clock, MapPin, ShoppingBag, Euro } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';

export default function TakeawayScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleCallPress = () => {
    Linking.openURL('tel:+32465206024');
  };

  const handleOrderOnlinePress = () => {
    // In a real app, this would open the ordering platform
    Linking.openURL('https://eastatwest.com/order');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flex: 1,
    },
    headerSection: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 28,
      textAlign: 'center',
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    actionSection: {
      padding: theme.spacing.lg,
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    actionButtonText: {
      fontSize: 18,
      fontFamily: theme.fonts.bodyBold,
      color: '#FFFFFF',
      marginTop: theme.spacing.sm,
    },
    secondaryButtonText: {
      color: theme.colors.primary,
    },
    infoSection: {
      padding: theme.spacing.lg,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    infoTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
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
    highlightText: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodySemiBold,
    },
    menuPreview: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      margin: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    menuTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    menuItemName: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
      flex: 1,
    },
    menuItemPrice: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.primary,
    },
    viewFullMenuButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    viewFullMenuText: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: '#FFFFFF',
    },
  });

  const popularItems = [
    { name: 'Chicken Shawarma', price: '€16.50' },
    { name: 'Mixed Grill Platter', price: '€22.00' },
    { name: 'Hummus & Falafel', price: '€12.50' },
    { name: 'Lamb Kebab', price: '€19.00' },
    { name: 'Vegetarian Mezze', price: '€18.00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('takeaway.title')}</Text>
          <Text style={styles.subtitle}>{t('takeaway.subtitle')}</Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOrderOnlinePress}>
            <ShoppingBag size={32} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{t('takeaway.orderOnline')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]} 
            onPress={handleCallPress}
          >
            <Phone size={32} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              {t('takeaway.callToOrder')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Pickup Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.highlightText}>{t('takeaway.pickupTime')}</Text>
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MapPin size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>Bld de l'Empereur 26, 1000 Brussels</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Phone size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>+32 465 20 60 24</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Delivery Information</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MapPin size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>{t('takeaway.deliveryArea')}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Euro size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.highlightText}>{t('takeaway.minOrder')}</Text>
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.infoText}>Delivery in 30-45 minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuPreview}>
          <Text style={styles.menuTitle}>Popular Items</Text>
          {popularItems.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemPrice}>{item.price}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.viewFullMenuButton}>
            <Text style={styles.viewFullMenuText}>View Full Menu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}