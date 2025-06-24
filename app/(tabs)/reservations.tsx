import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { Calendar } from '@/components/Calendar';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { TimePickerModal } from '@/components/TimePickerModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function ReservationsScreen() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startTime: '',
    endTime: '',
    guests: 1,
    additionalInfo: '',
  });

  const handleTimeSelect = (time: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setFormData(prev => ({ ...prev, startTime: time }));
      setShowStartTimePicker(false);
    } else {
      setFormData(prev => ({ ...prev, endTime: time }));
      setShowEndTimePicker(false);
    }
  };

  const handleSubmit = async () => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      Alert.alert(
        'Configuration Error', 
        'The reservation system is not properly configured. Please contact the restaurant directly at +32 465 20 60 24 to make your reservation.'
      );
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    if (!formData.startTime.trim()) {
      Alert.alert('Error', 'Please enter start time');
      return;
    }
    if (formData.guests < 1 || formData.guests > 22) {
      Alert.alert('Error', 'Number of guests must be between 1 and 22');
      return;
    }

    setLoading(true);
    try {
      // Format the time for storage
      const timeString = formData.endTime 
        ? `${formData.startTime} - ${formData.endTime}`
        : formData.startTime;

      // Determine status based on guest count
      const status = formData.guests <= 6 ? 'confirmed' : 'pending';

      // Insert reservation into Supabase
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          date: selectedDate.toISOString().split('T')[0],
          time: timeString,
          guests: formData.guests,
          additional_info: formData.additionalInfo.trim() || null,
          status: status,
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Send confirmation email
      try {
        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
        
        // Validate environment variables before making the request
        if (supabaseUrl && supabaseAnonKey && 
            supabaseUrl.startsWith('https://') && 
            !supabaseUrl.includes('sb_secret_') &&
            !supabaseAnonKey.startsWith('https://')) {
          
          const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-reservation-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              reservation: data,
              language: i18n.language,
            }),
          });

          if (!emailResponse.ok) {
            console.warn('Failed to send confirmation email:', await emailResponse.text());
          }
        } else {
          console.warn('Email service not configured - skipping confirmation email');
        }
      } catch (emailError) {
        console.warn('Email sending error:', emailError);
      }

      // Show appropriate message based on status
      if (status === 'pending') {
        Alert.alert(
          'Reservation Pending',
          'Your reservation is pending. We\'ll send you a confirmation when approved.',
          [{ text: 'OK', onPress: () => {} }]
        );
      } else {
        // Show confirmation modal for confirmed reservations
        setReservationData(data);
        setShowConfirmation(true);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        startTime: '',
        endTime: '',
        guests: 1,
        additionalInfo: '',
      });
      setSelectedDate(null);

    } catch (error) {
      console.error('Error submitting reservation:', error);
      Alert.alert(
        'Reservation Error', 
        'Unable to process your reservation at this time. Please try again or contact us directly at +32 465 20 60 24.'
      );
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
      fontSize: 24,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    formContainer: {
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    calendarContainer: {
      marginBottom: theme.spacing.lg,
    },
    inputGroup: {
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
    timeRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    timeInput: {
      flex: 1,
    },
    timeButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      justifyContent: 'center',
    },
    timeButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: formData.startTime || formData.endTime ? theme.colors.text : theme.colors.textSecondary,
    },
    guestSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
    },
    guestButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    guestButtonText: {
      fontSize: 18,
      fontFamily: theme.fonts.bodyBold,
      color: '#FFFFFF',
    },
    guestCount: {
      fontSize: 18,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
      marginHorizontal: theme.spacing.lg,
      minWidth: 30,
      textAlign: 'center',
    },
    guestNote: {
      fontSize: 12,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      fontStyle: 'italic',
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    primaryButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.bodyBold,
      color: '#FFFFFF',
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>{t('reservations.title')}</Text>
        </View>

        <View style={styles.businessHoursSection}>
          <Text style={styles.businessHoursTitle}>{t('reservations.businessHours')} & {t('reservations.bookingTimes')}</Text>
          
          <View style={styles.hoursGrid}>
            <View style={styles.hoursSection}>
              <Text style={styles.hoursSectionTitle}>{t('reservations.lunch')}</Text>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>12:00 – 14:00</Text>
              </View>
              <Text style={styles.lastReservationNote}>{t('reservations.lastReservation')} 13:30</Text>
            </View>

            <View style={styles.hoursSection}>
              <Text style={styles.hoursSectionTitle}>{t('reservations.dinner')}</Text>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>Monday - Friday</Text>
                <Text style={styles.hoursTime}>18:00 – 22:00</Text>
              </View>
              <View style={styles.hoursRow}>
                <Text style={styles.hoursLabel}>{t('reservations.saturday')}</Text>
                <Text style={styles.hoursTime}>18:00 – 22:00</Text>
              </View>
              <Text style={styles.lastReservationNote}>{t('reservations.lastReservation')} 20:30</Text>
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{t('reservations.chooseDate')}</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('reservations.yourName')}</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder={t('reservations.namePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('reservations.yourEmail')}</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder={t('reservations.emailPlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('reservations.contactQuestion')}</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder={t('reservations.phonePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('reservations.chooseTime')}</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formData.startTime || t('reservations.timePlaceholder')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeInput}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={styles.timeButtonText}>
                    {formData.endTime || t('reservations.untilPlaceholder')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('reservations.totalGuests')}</Text>
            <View style={styles.guestSelector}>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => setFormData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
              >
                <Text style={styles.guestButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.guestCount}>{formData.guests}</Text>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => setFormData(prev => ({ ...prev, guests: Math.min(22, prev.guests + 1) }))}
              >
                <Text style={styles.guestButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.guestNote}>
              {formData.guests <= 6 
                ? 'Reservations for 1-6 people are confirmed automatically'
                : 'Reservations for 7+ people require approval and will be pending'
              }
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('reservations.additionalInfo')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.additionalInfo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, additionalInfo: text }))}
              placeholder={t('reservations.messagePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'BOOKING...' : t('reservations.bookTable')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {reservationData && (
        <ConfirmationModal
          visible={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          reservationData={reservationData}
        />
      )}

      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onTimeSelect={(time) => handleTimeSelect(time, 'start')}
        title="Select Start Time"
      />

      <TimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onTimeSelect={(time) => handleTimeSelect(time, 'end')}
        title="Select End Time"
      />
    </SafeAreaView>
  );
}