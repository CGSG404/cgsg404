// Enhanced auth fallback for OAuth issues
import { supabase } from './supabaseClient';

export interface AuthFallbackResult {
  success: boolean;
  data?: any;
  error?: string;
  method?: string;
}

export const attemptAuthFallback = async (code: string): Promise<AuthFallbackResult> => {
  console.log('🔧 Starting auth fallback sequence...');
  
  // Method 1: Standard Supabase exchange
  try {
    console.log('🔄 Method 1: Standard exchange...');
    const result = await supabase.auth.exchangeCodeForSession(code);
    
    if (result.data?.session && !result.error) {
      console.log('✅ Method 1 successful');
      return {
        success: true,
        data: result.data,
        method: 'standard'
      };
    }
  } catch (error) {
    console.log('❌ Method 1 failed:', error);
  }

  // Method 2: Use Supabase's built-in session detection
  try {
    console.log('🔄 Method 2: Session detection...');

    // Wait for Supabase to detect session from URL
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: { session }, error } = await supabase.auth.getSession();

    if (session && !error) {
      console.log('✅ Method 2 successful - session detected');
      return {
        success: true,
        data: { session },
        method: 'session_detection'
      };
    }
  } catch (error) {
    console.log('❌ Method 2 failed:', error);
  }

  // Method 3: Force session refresh
  try {
    console.log('🔄 Method 3: Force session refresh...');

    const { data, error } = await supabase.auth.refreshSession();

    if (data?.session && !error) {
      console.log('✅ Method 3 successful');
      return {
        success: true,
        data: data,
        method: 'session_refresh'
      };
    }
  } catch (error) {
    console.log('❌ Method 3 failed:', error);
  }

  // Method 3: Retry with delay
  try {
    console.log('🔄 Method 3: Delayed retry...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = await supabase.auth.exchangeCodeForSession(code);
    
    if (result.data?.session && !result.error) {
      console.log('✅ Method 3 successful');
      return {
        success: true,
        data: result.data,
        method: 'delayed_retry'
      };
    }
  } catch (error) {
    console.log('❌ Method 3 failed:', error);
  }

  // Method 4: Force new OAuth flow
  try {
    console.log('🔄 Method 4: Force new OAuth...');
    
    // Clear everything
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    
    // Wait and redirect to new OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: false,
      error: 'All methods failed - redirecting to new OAuth',
      method: 'force_new_oauth'
    };
  } catch (error) {
    console.log('❌ Method 4 failed:', error);
  }

  return {
    success: false,
    error: 'All authentication methods failed',
    method: 'none'
  };
};

export const handleAuthError = (error: string, details?: string) => {
  console.error('🚨 Auth error:', { error, details });
  
  const errorMap: Record<string, string> = {
    'session_failed': 'Failed to create session. Please try again.',
    'invalid_code': 'Invalid authorization code. Please try again.',
    'auth_failed': 'Authentication failed. Please try again.',
    'callback_failed': 'Login callback failed. Please try again.',
    'no_code': 'No authorization code received. Please try again.',
  };
  
  return errorMap[error] || 'Login failed. Please try again.';
};

export const clearAuthData = async () => {
  try {
    console.log('🧹 Clearing all auth data...');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all possible storage keys
    const keysToRemove = [
      'sb-auth-token',
      'sb-plhpubcmugqosexcgdhj-auth-token',
      'supabase.auth.token',
      'sb-access-token',
      'sb-refresh-token',
      'sb-provider-token',
      'sb-user',
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`Failed to clear ${key}:`, e);
      }
    });
    
    // Clear cookies if any
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (name.trim().includes('sb-') || name.trim().includes('supabase')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
    
    console.log('✅ Auth data cleared');
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
  }
};
