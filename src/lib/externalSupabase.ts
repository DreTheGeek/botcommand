import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqmhvckilhevjqnjczjc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_EXTERNAL_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbWh2Y2tpbGhldmpxbmpjempjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMjk1NzIsImV4cCI6MjA4NjYwNTU3Mn0.faWYhlzg6d4tbvuW0svTTg3sAQzDcB313SWMWxTVZ9Q';

export const externalSupabase: SupabaseClient | null = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
