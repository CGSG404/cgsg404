import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prevent multiple instances of Supabase client in development
declare global {
  var supabaseAdmin: SupabaseClient | undefined;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is missing from environment variables for server client.');
}

// The `global` variable is not available in the edge runtime.
// We are caching the client in the global scope to prevent creating a new client on every hot-reload.
// This is only done in development.

let supabaseAdmin: SupabaseClient;

if (process.env.NODE_ENV === 'development') {
  if (!global.supabaseAdmin) {
    global.supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  supabaseAdmin = global.supabaseAdmin;
} else {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabaseAdmin };
