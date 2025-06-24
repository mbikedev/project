import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  reservationData: {
    reservation_number: string;
    name: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    guests: number;
    additional_info?: string;
  };
}

export function ConfirmationModal({ visible, onClose, reservationData }: ConfirmationModalProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      margin: theme.spacing.lg,
      maxWidth: 400,
      width: '90%',
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      padding: theme.spacing.xs,
    },
    successIcon: {
      alignSelf: 'center',
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.success + '20',
      borderRadius: 50,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 24,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    message: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight: 24,
    },
    detailsContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    detailLabel: {
      fontSize: 14,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
    },
    detailValue: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      flex: 1,
      textAlign: 'right',
    },
    reservationNumber: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    okButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    okButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: '#FFFFFF',
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.successIcon}>
            <Check size={40} color={theme.colors.success} />
          </View>

          <Text style={styles.title}>{t('reservations.confirmationTitle')}</Text>
          
          <Text style={styles.message}>
            {t('reservations.confirmationMessage')}
          </Text>

          <Text style={styles.reservationNumber}>
            {t('reservations.reservationNumber')}: {reservationData.reservation_number}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{reservationData.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{reservationData.email}</Text>
            </View>
            {reservationData.phone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{reservationData.phone}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(reservationData.date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{reservationData.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guests:</Text>
              <Text style={styles.detailValue}>{reservationData.guests}</Text>
            </View>
            {reservationData.additional_info && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{reservationData.additional_info}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}