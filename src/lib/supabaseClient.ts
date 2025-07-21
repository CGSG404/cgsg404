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
        // 🚀 PRODUCTION FIX: Enhanced key detection and fallback strategy
        const isAuthKey = key.includes('auth') || key.includes('session') || key.includes('token') ||
                         key.startsWith('sb-') || key.includes('supabase');

        if (isAuthKey) {
          // 🔍 Try multiple key variations for maximum compatibility
          const keyVariations = [
            key,
            'sb-auth-token',
            `sb-plhpubcmugqosexcgdhj-auth-token`,
            'supabase.auth.token',
            `supabase.auth.${key}`,
            `sb-${key}`
          ];

          // Try localStorage first (primary storage)
          for (const keyVariation of keyVariations) {
            try {
              const value = localStorage.getItem(keyVariation);
              if (value && value !== 'null' && value !== 'undefined') {
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔑 Retrieved from localStorage:', keyVariation);
                }
                return value;
              }
            } catch (e) {
              console.warn(`⚠️ localStorage access failed for ${keyVariation}:`, e);
            }
          }

          // Try sessionStorage as fallback
          for (const keyVariation of keyVariations) {
            try {
              const value = sessionStorage.getItem(keyVariation);
              if (value && value !== 'null' && value !== 'undefined') {
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔑 Retrieved from sessionStorage:', keyVariation);
                }
                return value;
              }
            } catch (e) {
              console.warn(`⚠️ sessionStorage access failed for ${keyVariation}:`, e);
            }
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
        console.error('❌ Storage getItem error:', error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      if (!value || value === 'null' || value === 'undefined') {
        console.warn('⚠️ Attempting to store invalid session value');
        return;
      }

      try {
        // 🚀 PRODUCTION FIX: Enhanced storage strategy for auth tokens
        const isAuthKey = key.includes('auth') || key.includes('session') || key.includes('token') ||
                         key.startsWith('sb-') || key.includes('supabase');

        if (isAuthKey) {
          // 🔧 Store in multiple locations for maximum compatibility
          const storageKeys = [
            key,
            'sb-auth-token',
            `sb-plhpubcmugqosexcgdhj-auth-token`
          ];

          let successCount = 0;

          // Store in localStorage (primary)
          storageKeys.forEach(storageKey => {
            try {
              localStorage.setItem(storageKey, value);
              successCount++;
              if (process.env.NODE_ENV === 'development') {
                console.log('🔑 Stored in localStorage:', storageKey);
              }
            } catch (e) {
              console.warn(`⚠️ localStorage store failed for ${storageKey}:`, e);
            }
          });

          // Store in sessionStorage (backup)
          storageKeys.forEach(storageKey => {
            try {
              sessionStorage.setItem(storageKey, value);
              if (process.env.NODE_ENV === 'development') {
                console.log('🔑 Backup stored in sessionStorage:', storageKey);
              }
            } catch (e) {
              console.warn(`⚠️ sessionStorage store failed for ${storageKey}:`, e);
            }
          });

          if (successCount === 0) {
            throw new Error('Failed to store session in any localStorage location');
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
        console.error('❌ Storage setItem error:', error);
        // Fallback to sessionStorage
        try {
          sessionStorage.setItem(key, value);
        } catch (fallbackError) {
          console.error('❌ Fallback storage failed:', fallbackError);
          throw fallbackError;
        }
      }
    },
    removeItem: (key: string) => {
      try {
        // 🚀 PRODUCTION FIX: Remove from all possible storage locations
        const keysToRemove = [
          key,
          'sb-auth-token',
          `sb-plhpubcmugqosexcgdhj-auth-token`,
          'supabase.auth.token',
          `supabase.auth.${key}`,
          `sb-${key}`
        ];

        keysToRemove.forEach(keyToRemove => {
          try {
            localStorage.removeItem(keyToRemove);
            sessionStorage.removeItem(keyToRemove);
          } catch (e) {
            console.warn(`⚠️ Failed to remove ${keyToRemove}:`, e);
          }
        });

        if (process.env.NODE_ENV === 'development') {
          console.log('🗑️ Cleaned up session storage for:', key);
        }
      } catch (error) {
        console.error('❌ Storage removeItem error:', error);
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
