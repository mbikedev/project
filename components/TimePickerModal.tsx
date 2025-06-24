import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  title: string;
}

export function TimePickerModal({ visible, onClose, onTimeSelect, title }: TimePickerModalProps) {
  const { theme } = useTheme();
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const handleConfirm = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeSelect(formattedTime);
  };

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
      maxWidth: 350,
      width: '90%',
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 20,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    pickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.xl,
    },
    pickerColumn: {
      flex: 1,
      alignItems: 'center',
    },
    pickerLabel: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    pickerScroll: {
      maxHeight: 200,
    },
    timeOption: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.xs,
      minWidth: 60,
      alignItems: 'center',
    },
    selectedTimeOption: {
      backgroundColor: theme.colors.primary,
    },
    timeOptionText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
    },
    selectedTimeOptionText: {
      color: '#FFFFFF',
      fontFamily: theme.fonts.bodySemiBold,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    confirmButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
    },
    confirmButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.bodySemiBold,
      color: '#FFFFFF',
    },
    separator: {
      fontSize: 24,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      alignSelf: 'center',
      marginTop: theme.spacing.lg,
    },
  });

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
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeOption,
                      selectedHour === hour && styles.selectedTimeOption,
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        selectedHour === hour && styles.selectedTimeOptionText,
                      ]}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.separator}>:</Text>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minute</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timeOption,
                      selectedMinute === minute && styles.selectedTimeOption,
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        selectedMinute === minute && styles.selectedTimeOptionText,
                      ]}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}