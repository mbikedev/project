import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

async function createReservation(data) {
  const { error } = await supabase.from('reservations').insert([data]);
  if (error) throw error;
  // Optionally, call your Edge Function for sending email
}