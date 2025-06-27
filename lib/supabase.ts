import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Enhanced validation to prevent placeholder values and invalid URLs
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase.co');
  } catch {
    return false;
  }
};

const isValidKey = (key: string): boolean => {
  return key.length > 50 && !key.includes('your_') && !key.includes('here');
};

// Check for placeholder values and valid configuration
const hasValidConfig = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_url_here') &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here') &&
  !supabaseAnonKey.includes('your_actual_anon_key_here') &&
  isValidUrl(supabaseUrl) &&
  isValidKey(supabaseAnonKey)
);

// Create client only if configuration is valid
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Disable session persistence to avoid async issues during startup
      },
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return hasValidConfig && !!supabase;
};

// Add global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the default behavior (which would crash the app)
    event.preventDefault();
  });
}

// Only log in development
if (process.env.NODE_ENV === 'development') {
  if (!hasValidConfig) {
    if (supabaseUrl.includes('your_supabase_url_here') || supabaseUrl.includes('your-project-ref')) {
      console.warn('⚠️ Supabase URL contains placeholder values. Please update EXPO_PUBLIC_SUPABASE_URL in your .env file with your actual Supabase project URL.');
    } else if (supabaseAnonKey.includes('your_supabase_anon_key_here') || supabaseAnonKey.includes('your_actual_anon_key_here')) {
      console.warn('⚠️ Supabase anon key contains placeholder values. Please update EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file with your actual Supabase anon key.');
    } else if (!isValidUrl(supabaseUrl)) {
      console.warn('⚠️ Invalid Supabase URL format. Please ensure EXPO_PUBLIC_SUPABASE_URL is a valid HTTPS URL ending with .supabase.co');
    } else {
      console.warn('⚠️ Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file');
    }
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
          status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
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
          status?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
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
          status?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
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