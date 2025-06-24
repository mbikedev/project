import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, Users, Mail, Phone, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, MoveHorizontal as MoreHorizontal, Lock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Reservation {
  id: string;
  reservation_number: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  additional_info?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  created_at: string;
}

export default function AdminScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('pending');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (authChecked) {
      loadReservations();
    }
  }, [authChecked, isAdmin]);

  const checkAdminStatus = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setAuthChecked(true);
      return;
    }

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No authenticated user
        setIsAdmin(false);
        setAuthChecked(true);
        return;
      }

      // Check if user has admin role in JWT claims
      const userRole = session.user?.user_metadata?.role || 
                      session.user?.app_metadata?.role ||
                      (session.user as any)?.role;
      
      setIsAdmin(userRole === 'admin');
      setAuthChecked(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAuthChecked(true);
    }
  };

  const loadReservations = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      Alert.alert('Configuration Error', 'Admin panel requires Supabase configuration.');
      setLoading(false);
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reservations:', error);
        if (error.code === 'PGRST116' || error.message.includes('permission')) {
          Alert.alert('Access Denied', 'You do not have admin permissions to view reservations.');
        } else {
          Alert.alert('Error', 'Failed to load reservations');
        }
      } else {
        setReservations(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load reservations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReservations();
  };

  const updateReservationStatus = async (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    if (!supabase || !isAdmin) {
      Alert.alert('Access Denied', 'You do not have permission to update reservations.');
      return;
    }

    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating reservation:', error);
        if (error.code === 'PGRST116' || error.message.includes('permission')) {
          Alert.alert('Access Denied', 'You do not have admin permissions to update reservations.');
        } else {
          Alert.alert('Error', 'Failed to update reservation status');
        }
      } else {
        Alert.alert('Success', `Reservation ${newStatus} successfully`);
        loadReservations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to update reservation status');
    }
  };

  const showStatusOptions = (reservation: Reservation) => {
    if (!isAdmin) {
      Alert.alert('Access Denied', 'You do not have permission to update reservations.');
      return;
    }

    const options = [
      { text: 'Confirm', onPress: () => updateReservationStatus(reservation.id, 'confirmed') },
      { text: 'Cancel', onPress: () => updateReservationStatus(reservation.id, 'cancelled') },
      { text: 'Complete', onPress: () => updateReservationStatus(reservation.id, 'completed') },
      { text: 'Close', style: 'cancel' as const },
    ];

    Alert.alert(
      'Update Status',
      `Change status for reservation ${reservation.reservation_number}?`,
      options
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'cancelled': return theme.colors.error;
      case 'completed': return theme.colors.primary;
      case 'pending': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    const color = getStatusColor(status);
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} color={color} />;
      case 'cancelled': return <XCircle size={16} color={color} />;
      case 'completed': return <CheckCircle size={16} color={color} />;
      case 'pending': return <AlertCircle size={16} color={color} />;
      default: return <AlertCircle size={16} color={color} />;
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    filter === 'all' || reservation.status === filter
  );

  const getFilterCounts = () => {
    return {
      all: reservations.length,
      pending: reservations.filter(r => r.status === 'pending').length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
      completed: reservations.filter(r => r.status === 'completed').length,
    };
  };

  const counts = getFilterCounts();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    filterContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    filterButton: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      alignItems: 'center',
    },
    activeFilterButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonText: {
      fontSize: 12,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
    },
    activeFilterButtonText: {
      color: '#FFFFFF',
    },
    filterCount: {
      fontSize: 10,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    activeFilterCount: {
      color: '#FFFFFF',
    },
    scrollContent: {
      flex: 1,
    },
    reservationCard: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    reservationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    reservationNumber: {
      fontSize: 16,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.primary,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    statusText: {
      fontSize: 12,
      fontFamily: theme.fonts.bodySemiBold,
      textTransform: 'uppercase',
    },
    reservationInfo: {
      gap: theme.spacing.sm,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    infoText: {
      fontSize: 14,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
      flex: 1,
    },
    infoLabel: {
      fontFamily: theme.fonts.bodySemiBold,
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    disabledActionButton: {
      backgroundColor: theme.colors.border,
    },
    actionButtonText: {
      fontSize: 14,
      fontFamily: theme.fonts.bodySemiBold,
      color: '#FFFFFF',
    },
    disabledActionButtonText: {
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    accessDeniedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    accessDeniedIcon: {
      marginBottom: theme.spacing.lg,
    },
    accessDeniedTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.headingBold,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    accessDeniedText: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (!authChecked || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {!authChecked ? 'Checking permissions...' : 'Loading reservations...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.accessDeniedContainer}>
          <View style={styles.accessDeniedIcon}>
            <Lock size={64} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            You need admin privileges to access this panel. Please contact your administrator if you believe this is an error.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.headerSection}>
        <Text style={styles.title}>Admin Panel</Text>
        
        <View style={styles.filterContainer}>
          {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterButton,
                filter === filterOption && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === filterOption && styles.activeFilterButtonText,
                ]}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
              <Text
                style={[
                  styles.filterCount,
                  filter === filterOption && styles.activeFilterCount,
                ]}
              >
                {counts[filterOption]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredReservations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {filter === 'all' ? '' : filter} reservations found
            </Text>
          </View>
        ) : (
          filteredReservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              <View style={styles.reservationHeader}>
                <Text style={styles.reservationNumber}>
                  {reservation.reservation_number}
                </Text>
                <View style={styles.statusContainer}>
                  {getStatusIcon(reservation.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
                    {reservation.status}
                  </Text>
                </View>
              </View>

              <View style={styles.reservationInfo}>
                <View style={styles.infoRow}>
                  <Users size={16} color={theme.colors.primary} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Guest:</Text> {reservation.name}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Mail size={16} color={theme.colors.primary} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Email:</Text> {reservation.email}
                  </Text>
                </View>

                {reservation.phone && (
                  <View style={styles.infoRow}>
                    <Phone size={16} color={theme.colors.primary} />
                    <Text style={styles.infoText}>
                      <Text style={styles.infoLabel}>Phone:</Text> {reservation.phone}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Calendar size={16} color={theme.colors.primary} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Date:</Text> {new Date(reservation.date).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Clock size={16} color={theme.colors.primary} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Time:</Text> {reservation.time}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Users size={16} color={theme.colors.primary} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Guests:</Text> {reservation.guests}
                  </Text>
                </View>

                {reservation.additional_info && (
                  <View style={styles.infoRow}>
                    <MoreHorizontal size={16} color={theme.colors.primary} />
                    <Text style={styles.infoText}>
                      <Text style={styles.infoLabel}>Notes:</Text> {reservation.additional_info}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  !isAdmin && styles.disabledActionButton,
                ]}
                onPress={() => showStatusOptions(reservation)}
                disabled={!isAdmin}
              >
                <Text style={[
                  styles.actionButtonText,
                  !isAdmin && styles.disabledActionButtonText,
                ]}>
                  Update Status
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}