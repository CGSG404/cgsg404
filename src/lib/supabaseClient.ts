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
      // Check if cookies are allowed
      const cookieConsent = localStorage.getItem('cookie-consent');
      if (!cookieConsent) {
        console.log('🍪 No cookie consent found, using sessionStorage for:', key);
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
    },
    setItem: (key: string, value: string) => {
      // Check if cookies are allowed
      const cookieConsent = localStorage.getItem('cookie-consent');
      if (!cookieConsent) {
        console.log('🍪 No cookie consent found, using sessionStorage for:', key);
        sessionStorage.setItem(key, value);
        return;
      }

      try {
        const consent = JSON.parse(cookieConsent);
        if (consent.necessary) {
          localStorage.setItem(key, value);
          // Also set as HTTP cookie for better persistence
          const expires = new Date();
          expires.setDate(expires.getDate() + 7); // 7 days
          document.cookie = `${key}=${encodeURIComponent(value)}; path=/; secure; samesite=lax; expires=${expires.toUTCString()}`;
        } else {
          sessionStorage.setItem(key, value);
        }
      } catch {
        sessionStorage.setItem(key, value);
      }
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      // Remove HTTP cookie
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
