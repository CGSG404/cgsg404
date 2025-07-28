import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not configured. Using placeholder client.');
} else {
  console.log('✅ Supabase Server configured successfully');
}

// Use placeholder values if environment variables are not set
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder_key';

// Realtime disabled to avoid extra bundle/warning on server components
export const supabaseServer = createClient(url, key, {
  realtime: { params: { eventsPerSecond: 0 } },
  auth: { persistSession: false },
});
