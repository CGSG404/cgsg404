// Debug utilities for OAuth authentication
import { supabase } from './supabaseClient';

export const debugAuthFlow = () => {
  console.log('🔍 Auth Debug Information:');
  console.log('📍 Current URL:', window.location.href);
  console.log('🌐 Origin:', window.location.origin);
  console.log('📝 Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    HAS_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  
  // Check current session
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    console.log('👤 Current Session:', {
      hasSession: !!session,
      user: session?.user?.email,
      expires: session?.expires_at,
      error: error?.message
    });
  });
  
  // Check storage
  const storageKeys = [
    'sb-auth-token',
    'sb-plhpubcmugqosexcgdhj-auth-token',
    'supabase.auth.token'
  ];
  
  console.log('💾 Storage Check:');
  storageKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      console.log(`  ${key}:`, value ? 'Present' : 'Missing');
    } catch (e) {
      console.log(`  ${key}:`, 'Error accessing');
    }
  });
};

export const testOAuthConfig = async () => {
  console.log('🧪 Testing OAuth Configuration...');
  
  try {
    // Test if we can reach Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test OAuth provider configuration
    try {
      const testUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google`;
      console.log('🔗 OAuth URL would be:', testUrl);
      
      return true;
    } catch (urlError) {
      console.error('❌ OAuth URL construction failed:', urlError);
      return false;
    }
    
  } catch (error) {
    console.error('❌ OAuth test failed:', error);
    return false;
  }
};

export const clearAllAuthData = async () => {
  console.log('🧹 Clearing all authentication data...');
  
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    console.log('✅ Supabase sign out complete');
    
    // Clear localStorage
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
    console.log('✅ Storage cleared');
    
    // Clear cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (name.trim().includes('sb-') || name.trim().includes('supabase')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
    console.log('✅ Cookies cleared');
    
    console.log('✅ All auth data cleared successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};

export const validateEnvironment = () => {
  console.log('🔍 Validating Environment...');
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    return false;
  }
  
  // Validate URL format
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    console.log('✅ Supabase URL format valid');
  } catch (e) {
    console.error('❌ Invalid Supabase URL format');
    return false;
  }
  
  // Validate key format (should be JWT)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!anonKey.startsWith('eyJ')) {
    console.error('❌ Anon key doesn\'t appear to be a valid JWT');
    return false;
  }
  
  console.log('✅ Environment validation passed');
  return true;
};

export const debugCallback = (searchParams: URLSearchParams) => {
  console.log('🔍 Callback Debug Information:');
  
  const params = {
    code: searchParams.get('code'),
    state: searchParams.get('state'),
    error: searchParams.get('error'),
    error_description: searchParams.get('error_description'),
    access_token: searchParams.get('access_token'),
    refresh_token: searchParams.get('refresh_token'),
  };
  
  console.log('📝 URL Parameters:', params);
  
  if (params.code) {
    console.log('🔑 Authorization Code Details:', {
      length: params.code.length,
      preview: params.code.substring(0, 20) + '...',
      hasSpecialChars: /[^a-zA-Z0-9\-_]/.test(params.code)
    });
  }
  
  if (params.error) {
    console.error('❌ OAuth Error:', {
      error: params.error,
      description: params.error_description
    });
  }
  
  return params;
};

// Global debug functions for browser console
if (typeof window !== 'undefined') {
  (window as any).authDebug = {
    debugAuthFlow,
    testOAuthConfig,
    clearAllAuthData,
    validateEnvironment,
    debugCallback: () => debugCallback(new URLSearchParams(window.location.search))
  };
  
  console.log('🔧 Auth debug functions available at window.authDebug');
}
