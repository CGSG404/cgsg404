import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Realtime disabled to avoid extra bundle/warning on server components
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 0 } },
  auth: { persistSession: false },
});
