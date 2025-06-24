import { createClient } from '@supabase/supabase-js';

// Provide fallback values to prevent initialization errors
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create client if we have real values (not placeholders)
const hasValidConfig = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => hasValidConfig;

export type Database = {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          notes: string | null;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          date: string;
          time: string;
          guests: number;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          date?: string;
          time?: string;
          guests?: number;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
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

async function createReservation(data: any) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
  
  const { error } = await supabase.from('reservations').insert([data]);
  if (error) throw error;
  // Optionally, call your Edge Function for sending email
}