import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <View style={styles.emptyDay} />
        </View>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isPast = isPastDate(date);
      const todayDate = isToday(date);

      days.push(
        <View key={day} style={styles.dayCell}>
          <TouchableOpacity
            style={[
              styles.dayButton,
              isSelected && styles.selectedDay,
              todayDate && styles.todayDay,
              isPast && styles.pastDay,
            ]}
            onPress={() => !isPast && onDateSelect(date)}
            disabled={isPast}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                todayDate && styles.todayDayText,
                isPast && styles.pastDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return days;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      ...theme.shadows.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    monthText: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
    },
    navButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      ...(Platform.OS === 'web' && { cursor: 'pointer' }),
    },
    weekDaysContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    weekDay: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
    },
    weekDayText: {
      fontSize: 12,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.textSecondary,
    },
    daysContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      padding: 2,
    },
    dayButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
      ...(Platform.OS === 'web' && { cursor: 'pointer' }),
    },
    emptyDay: {
      flex: 1,
    },
    dayText: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
    },
    selectedDay: {
      backgroundColor: theme.colors.primary,
    },
    selectedDayText: {
      color: '#FFFFFF',
      fontFamily: theme.fonts.bodySemiBold,
    },
    todayDay: {
      backgroundColor: theme.colors.primaryLight + '30',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    todayDayText: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodySemiBold,
    },
    pastDay: {
      opacity: 0.3,
      ...(Platform.OS === 'web' && { cursor: 'not-allowed' }),
    },
    pastDayText: {
      color: theme.colors.textSecondary,
    },
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth('prev')}>
          <ChevronLeft size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth('next')}>
          <ChevronRight size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {renderCalendarDays()}
      </View>
    </View>
  );
}