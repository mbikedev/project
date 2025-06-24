import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Simplified validation for development
const hasValidConfig = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl.length > 10 && supabaseAnonKey.length > 10);

// Create client only if configuration is valid
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return hasValidConfig && !!supabase;
};

// Only log in development
if (process.env.NODE_ENV === 'development') {
  if (!hasValidConfig) {
    console.warn('⚠️ Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
  } else {
    console.log('✅ Supabase configured successfully');
  }
}

export type Database = {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          reservation_number: string;
          name: string;
          email: string;
          phone: string | null;
          date: string;
          time: string;
          guests: number;
          additional_info: string | null;
          status: 'confirmed' | 'cancelled' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_number?: string;
          name: string;
          email: string;
          phone?: string | null;
          date: string;
          time: string;
          guests: number;
          additional_info?: string | null;
          status?: 'confirmed' | 'cancelled' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          reservation_number?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          date?: string;
          time?: string;
          guests?: number;
          additional_info?: string | null;
          status?: 'confirmed' | 'cancelled' | 'completed';
          created_at?: string;
        };
      };
      cancellations: {
        Row: {
          id: string;
          reservation_id: string | null;
          reason: string | null;
          cancelled_at: string;
        };
        Insert: {
          id?: string;
          reservation_id?: string | null;
          reason?: string | null;
          cancelled_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string | null;
          reason?: string | null;
          cancelled_at?: string;
        };
      };
    };
  };
};