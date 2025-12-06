import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
// For storage, we can use the anon key since we'll set up proper bucket policies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or Anon Key not set. Image uploads will use local storage.');
  console.warn('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.warn('Key:', supabaseAnonKey ? 'Set' : 'Missing');
} else {
  console.log('✅ Supabase client initialized');
  console.log('URL:', supabaseUrl);
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

