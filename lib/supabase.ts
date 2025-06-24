import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' && parsedUrl.hostname.includes('supabase');
  } catch {
    return false;
  }
};

const isValidKey = (key: string | undefined): boolean => {
  return !!(key && key.length > 20 && !key.startsWith('https://'));
};

// Check if configuration is valid
const hasValidConfig = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

// Create client only if configuration is valid
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => hasValidConfig;

// Log configuration status for debugging
if (!hasValidConfig) {
  console.warn('Supabase configuration invalid:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlValid: isValidUrl(supabaseUrl),
    keyValid: isValidKey(supabaseAnonKey),
  });
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
      menu_items: {
        Row: {
          id: string;
          name_en: string;
          name_fr: string;
          name_nl: string;
          description_en: string;
          description_fr: string;
          description_nl: string;
          price: number;
          category: string;
          image_url: string | null;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_en: string;
          name_fr: string;
          name_nl: string;
          description_en: string;
          description_fr: string;
          description_nl: string;
          price: number;
          category: string;
          image_url?: string | null;
          available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_fr?: string;
          name_nl?: string;
          description_en?: string;
          description_fr?: string;
          description_nl?: string;
          price?: number;
          category?: string;
          image_url?: string | null;
          available?: boolean;
          created_at?: string;
        };
      };
    };
  };
};