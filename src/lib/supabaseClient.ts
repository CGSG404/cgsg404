import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error("Missing Supabase environment variables");
}

// Log for debugging (remove in production)
console.log('🔧 Supabase Config:', {
  url: supabaseUrl.substring(0, 30) + '...',
  keyLength: supabaseAnonKey.length
});

// Custom storage implementation that respects cookie consent
const createCustomStorage = () => {
  if (typeof window === 'undefined') return undefined;

  return {
    getItem: (key: string) => {
      try {
        // 🚀 CRITICAL FIX: Handle Supabase's actual storage keys
        const isAuthKey = key.includes('auth') || key.includes('session') || key.includes('token') ||
                         key.startsWith('sb-') || key.includes('supabase');

        if (isAuthKey) {
          // Always try localStorage first for auth tokens
          const localValue = localStorage.getItem(key);
          if (localValue) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🔑 Retrieved from localStorage:', key);
            }
            return localValue;
          }

          // Fallback to sessionStorage
          const sessionValue = sessionStorage.getItem(key);
          if (sessionValue) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🔑 Retrieved from sessionStorage:', key);
            }
            return sessionValue;
          }

          return null;
        }

        // For non-auth data, respect cookie consent
        const cookieConsent = localStorage.getItem('cookie-consent');
        if (!cookieConsent) {
          return sessionStorage.getItem(key);
        }

        try {
          const consent = JSON.parse(cookieConsent);
          if (consent.necessary) {
            return localStorage.getItem(key);
          } else {
            return sessionStorage.getItem(key);
          }
        } catch {
          return sessionStorage.getItem(key);
        }
      } catch (error) {
        console.error('Storage getItem error:', error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        // 🚀 CRITICAL FIX: Handle Supabase's actual storage keys
        const isAuthKey = key.includes('auth') || key.includes('session') || key.includes('token') ||
                         key.startsWith('sb-') || key.includes('supabase');

        if (isAuthKey) {
          // Always use localStorage for auth tokens
          localStorage.setItem(key, value);

          if (process.env.NODE_ENV === 'development') {
            console.log('🔑 Stored in localStorage:', key, value.substring(0, 50) + '...');
          }
          return;
        }

        // For non-auth data, respect cookie consent
        const cookieConsent = localStorage.getItem('cookie-consent');
        if (!cookieConsent) {
          sessionStorage.setItem(key, value);
          return;
        }

        try {
          const consent = JSON.parse(cookieConsent);
          if (consent.necessary) {
            localStorage.setItem(key, value);
          } else {
            sessionStorage.setItem(key, value);
          }
        } catch {
          sessionStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn('⚠️ Storage setItem error:', error);
        // Fallback to sessionStorage
        try {
          sessionStorage.setItem(key, value);
        } catch (fallbackError) {
          console.error('Fallback storage failed:', fallbackError);
        }
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);

        if (process.env.NODE_ENV === 'development') {
          console.log('🗑️ Removed from storage:', key);
        }
      } catch (error) {
        console.warn('⚠️ Storage removeItem error:', error);
      }
    }
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable URL detection for OAuth callback
    flowType: 'pkce',
    storage: createCustomStorage(),
    debug: process.env.NODE_ENV === 'development',
    // 🚀 CRITICAL FIX: Use default storage key
    storageKey: 'sb-auth-token',
  },
  global: {
    headers: {
      'X-Client-Info': 'cgsg-casino-guide',
      'Access-Control-Allow-Credentials': 'true',
    },
  },
});

// 🚀 DEBUG: Add session state listener
if (process.env.NODE_ENV === 'development') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state changed:', {
      event,
      hasSession: !!session,
      user: session?.user?.email,
      expires: session?.expires_at
    });
  });
}
