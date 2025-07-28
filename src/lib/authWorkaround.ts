// Auth workaround for Supabase split function error
import { supabase } from './supabaseClient';

export const safeExchangeCodeForSession = async (code: string) => {
  try {
    // Validate code format first
    if (!code || typeof code !== 'string' || code.length < 10) {
      throw new Error('Invalid authorization code format');
    }

    console.log('🔧 Attempting safe code exchange...');
    
    // Try the normal exchange first
    const result = await supabase.auth.exchangeCodeForSession(code);
    
    if (result.error) {
      console.error('❌ Exchange error:', result.error);
      
      // Check for split function error
      const errorMessage = String(result.error.message || result.error || '');
      if (errorMessage.includes('split') || errorMessage.includes('intermediate value')) {
        console.log('🔧 Split error detected, attempting workaround...');
        
        // Try alternative approach: manual token exchange
        return await attemptManualTokenExchange(code);
      }
      
      return result;
    }
    
    console.log('✅ Normal exchange successful');
    return result;
    
  } catch (error) {
    console.error('❌ Safe exchange error:', error);

    // Check if this is the split error or other function errors
    const errorMessage = String(error);
    if (errorMessage.includes('split') ||
        errorMessage.includes('intermediate value') ||
        errorMessage.includes('is not a function') ||
        errorMessage.includes('Cannot read properties')) {
      console.log('🔧 Function error detected in catch block, attempting workaround...');
      return await attemptManualTokenExchange(code);
    }

    // Re-throw other errors
    throw error;
  }
};

const attemptManualTokenExchange = async (code: string) => {
  try {
    console.log('🔧 Attempting manual token exchange...');
    
    // Clear any existing session first
    await supabase.auth.signOut();
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Try to get the session using the code directly with fetch
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=authorization_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: '', // PKCE not used in this workaround
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Manual exchange failed: ${response.status}`);
    }
    
    const tokenData = await response.json();
    
    if (tokenData.access_token && tokenData.refresh_token) {
      console.log('✅ Manual exchange successful, setting session...');
      
      // Set the session manually
      const { data, error } = await supabase.auth.setSession({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } else {
      throw new Error('Invalid token response from manual exchange');
    }
    
  } catch (manualError) {
    console.error('❌ Manual exchange failed:', manualError);
    
    // Return error in expected format
    return {
      data: null,
      error: {
        message: `Manual token exchange failed: ${manualError instanceof Error ? manualError.message : String(manualError)}`
      }
    };
  }
};

export const clearAuthState = async () => {
  try {
    console.log('🧹 Clearing auth state...');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear localStorage
    const keysToRemove = [
      'sb-auth-token',
      'sb-plhpubcmugqosexcgdhj-auth-token',
      'supabase.auth.token',
      'sb-access-token',
      'sb-refresh-token'
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`Failed to clear ${key}:`, e);
      }
    });
    
    console.log('✅ Auth state cleared');
  } catch (error) {
    console.error('❌ Error clearing auth state:', error);
  }
};

export const validateAuthCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  // Basic validation - should be a reasonable length and contain valid characters
  if (code.length < 10 || code.length > 500) {
    return false;
  }
  
  // Should not contain obvious invalid characters
  if (code.includes('<') || code.includes('>') || code.includes('"')) {
    return false;
  }
  
  return true;
};
