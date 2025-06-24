import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// More lenient validation that works with actual Supabase configurations
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && 
           (parsedUrl.hostname.includes('supabase') || parsedUrl.hostname.includes('localhost'));
  } catch {
    return false;
  }
};

const isValidKey = (key: string): boolean => {
  // Supabase anon keys are typically long base64-like strings
  return !!(key && key.length > 30 && !key.startsWith('https://') && !key.includes('supabase.co'));
};

// Check if configuration is valid
const hasValidConfig = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

// Create client only if configuration is valid
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  // Additional runtime check
  if (!hasValidConfig) return false;
  
  // Verify the client was created successfully
  if (!supabase) return false;
  
  return true;
};

// Enhanced logging for debugging
if (!hasValidConfig) {
  console.warn('Supabase configuration validation failed:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length,
    urlValid: isValidUrl(supabaseUrl),
    keyValid: isValidKey(supabaseAnonKey),
    urlSample: supabaseUrl.substring(0, 20) + '...',
    keySample: supabaseAnonKey.substring(0, 20) + '...',
  });
} else {
  console.log('Supabase configuration validated successfully');
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