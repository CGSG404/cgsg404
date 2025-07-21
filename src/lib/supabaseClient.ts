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
        // 🚀 PRODUCTION FIX: Always try localStorage first for auth tokens
        if (key.includes('auth') || key.includes('session') || key.includes('token')) {
          const localValue = localStorage.getItem(key);
          if (localValue) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🔑 Retrieved auth token from localStorage:', key);
            }
            return localValue;
          }
        }

        // For auth tokens, also check sessionStorage as fallback
        if (key.includes('auth') || key.includes('session') || key.includes('token')) {
          const sessionValue = sessionStorage.getItem(key);
          if (sessionValue && process.env.NODE_ENV === 'development') {
            console.log('🔑 Retrieved auth token from sessionStorage:', key);
          }
          return sessionValue;
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
        // 🚀 PRODUCTION FIX: Always use localStorage for auth tokens
        if (key.includes('auth') || key.includes('session') || key.includes('token')) {
          localStorage.setItem(key, value);

          // 🔧 Also set HTTP cookie for maximum persistence in production
          if (process.env.NODE_ENV === 'production') {
            try {
              const expires = new Date();
              expires.setDate(expires.getDate() + 7); // 7 days
              document.cookie = `${key}=${encodeURIComponent(value)}; path=/; secure; samesite=lax; expires=${expires.toUTCString()}`;
            } catch (cookieError) {
              console.warn('Cookie setting failed:', cookieError);
            }
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('🔑 Stored auth token in localStorage:', key);
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
        // Remove HTTP cookie
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      } catch (error) {
        console.warn('⚠️ Storage removeItem error:', error);
        // Don't throw, just fail silently
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
    // Add storageKey to ensure consistency
    storageKey: 'sb-auth-token',
  },
  global: {
    headers: {
      'X-Client-Info': 'cgsg-casino-guide',
      'Access-Control-Allow-Credentials': 'true',
    },
  },
});
