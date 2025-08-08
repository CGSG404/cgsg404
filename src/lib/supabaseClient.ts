import { createClient } from '@supabase/supabase-js';

// Direct configuration with fallback values to avoid environment variable issues
const supabaseUrl = 'https://plhpubcmugqosexcgdhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaHB1YmNtdWdxb3NleGNnZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTM1MjQsImV4cCI6MjA2NjI2OTUyNH0.RvL-jUkEiCBrCywqC5dC2c8VxSt6ifjBRekkm82sMH4';

// Log configuration status in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase configured with direct values');
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export const isSupabaseConfigured = true;
