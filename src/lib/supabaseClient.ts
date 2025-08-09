import { createClient } from '@supabase/supabase-js';

// Read from environment variables (do not hardcode secrets)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Basic validation and safe logging
const hasValidEnv = Boolean(
  supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Only log high-level status without exposing secrets
  // eslint-disable-next-line no-console
  console.log(`🔧 Supabase client env status: ${hasValidEnv ? 'configured' : 'missing'}`);
}

export const supabase = hasValidEnv
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder_key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

export const isSupabaseConfigured = hasValidEnv;
