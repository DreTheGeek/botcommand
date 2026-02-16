import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqmhvckilhevjqnjczjc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_EXTERNAL_SUPABASE_ANON_KEY || '';

export const externalSupabase = createClient(supabaseUrl, supabaseAnonKey);
