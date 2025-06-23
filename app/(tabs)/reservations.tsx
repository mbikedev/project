import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Users, MessageSquare, Info } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_PUBLIC_ANON_KEY'
);

export default function ReservationsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // For now, just show success message. In production, uncomment the Supabase insert
      // const { error } = await supabase
      //   .from('reservations')
      //   .insert([{
      //     name: formData.name,
      //     email: formData.email,
      //     phone: formData.phone,
      //     date: formData.date,
      //     time: formData.time,
      //     guests: parseInt(formData.guests),
      //     notes: formData.notes,
      //   }]);

      // if (error) throw error;

      Alert.alert('Success', t('reservations.success'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      Alert.alert('Error', t('reservations.error'));
    } finally {
      setLoading(false);
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
    businessHoursSection: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.sm,
    },
    businessHoursTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    hoursGrid: {
      gap: theme.spacing.md,
    },
    hoursSection: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    hoursSectionTitle: {
      fontSize: 16,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
    },
    hoursLabel: {
      fontSize: 14,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
    },
    hoursTime: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
    },
    lastReservationNote: {
      fontSize: 12,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    formContainer: {
      padding: theme.spacing.lg,
    },
    formGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    submitButtonText: {
      fontSize: 18,
      fontFamily: theme.fonts.bodyBold,
      color: '#FFFFFF',
    },
    infoSection: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.lg,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
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
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('reservations.title')}</Text>
          <Text style={styles.subtitle}>{t('reservations.subtitle')}</Text>
        </View>

        <View style={styles.businessHoursSection}>
          <Text style={styles.businessHoursTitle}>Business Hours & Booking Times</Text>
          
          <View style={styles.hoursGrid}>
            <View style={styles.hoursSection}>
              <Text style={styles.hoursSectionTitle}>LUNCH</Text>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>12:00 – 14:00</Text>
              </View>
              <Text style={styles.lastReservationNote}>Last reservation at 13:30</Text>
            </View>

            <View style={styles.hoursSection}>
              <Text style={styles.hoursSectionTitle}>DINNER</Text>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>18:00 – 22:00</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>Saturday</Text>
                <Text style={styles.hoursTime}>18:00 – 22:00</Text>
              </View>
              <Text style={styles.lastReservationNote}>Last reservation at 20:30</Text>
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('reservations.form.name')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('reservations.form.email')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email address"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('reservations.form.phone')}</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('reservations.form.date')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('reservations.form.time')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => setFormData(prev => ({ ...prev, time: text }))}
                placeholder="HH:MM"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('reservations.form.guests')}</Text>
            <TextInput
              style={styles.input}
              value={formData.guests}
              onChangeText={(text) => setFormData(prev => ({ ...prev, guests: text }))}
              placeholder="Number of guests"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('reservations.form.notes')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Any special requests or dietary requirements"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? t('common.loading') : t('reservations.form.submit')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Reservation Information</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Clock size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.infoText}>
              Reservations are confirmed within 2 hours during business hours
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Users size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.infoText}>
              For parties of 8 or more, please call us directly
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MessageSquare size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.infoText}>
              Cancellations must be made at least 2 hours before your reservation
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}