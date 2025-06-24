import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  title: string;
}

export function TimePickerModal({ visible, onClose, onTimeSelect, title }: TimePickerModalProps) {
  const { theme } = useTheme();

  // Generate time slots for restaurant hours
  const generateTimeSlots = () => {
    const slots = [];
    
    // Lunch slots (12:00 - 14:00)
    for (let hour = 12; hour <= 13; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    // Dinner slots (18:00 - 22:00)
    for (let hour = 18; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: '80%',
      maxHeight: '70%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    closeButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.primary,
    },
    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    timeSlot: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      minWidth: '30%',
      alignItems: 'center',
    },
    timeSlotText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
    },
    sectionHeader: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.primary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
  });

  const lunchSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 12 && hour < 15;
  });

  const dinnerSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 18;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionHeader}>Lunch (12:00 - 14:00)</Text>
            <View style={styles.timeGrid}>
              {lunchSlots.map((time) => (
                <TouchableOpacity
                  key={`lunch-${time}`}
                  style={styles.timeSlot}
                  onPress={() => onTimeSelect(time)}
                >
                  <Text style={styles.timeSlotText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeader}>Dinner (18:00 - 22:00)</Text>
            <View style={styles.timeGrid}>
              {dinnerSlots.map((time) => (
                <TouchableOpacity
                  key={`dinner-${time}`}
                  style={styles.timeSlot}
                  onPress={() => onTimeSelect(time)}
                >
                  <Text style={styles.timeSlotText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}