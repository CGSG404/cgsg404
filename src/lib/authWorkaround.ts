// Enhanced auth workaround for Supabase OAuth issues
import { supabase } from './supabaseClient';
import { validateAuthCode } from './authUtils';

/**
 * Safely exchanges an authorization code for a session
 * Handles the Supabase split error that can occur during exchangeCodeForSession
 */
export const safeExchangeCodeForSession = async (code: string) => {
  try {
    // Validate code format first
    if (!validateAuthCode(code)) {
      console.error('❌ Invalid authorization code format');
      return {
        data: null,
        error: { message: 'Invalid authorization code format' }
      };
    }

    console.log('🔄 Attempting safe code exchange...');
    
    // Try normal exchange
    try {
      const result = await supabase.auth.exchangeCodeForSession(code);
      
      // Check for split error in error message
      if (result.error) {
        const errorMessage = String(result.error.message || result.error || '');
        if (errorMessage.includes('split') || errorMessage.includes('intermediate value')) {
          console.log('🔧 Split error detected, attempting workaround...');
          return await attemptManualTokenExchange(code);
        }
      }
      
      return result;
    } catch (error: any) {
      // Handle split error in catch block
      const errorMessage = String(error?.message || error || '');
      if (errorMessage.includes('split') || errorMessage.includes('intermediate value')) {
        console.log('🔧 Split error caught in exception, attempting workaround...');
        return await attemptManualTokenExchange(code);
      }
      
      // Re-throw other errors
      throw error;
    }
  } catch (error) {
    console.error('❌ Safe exchange failed:', error);
    return {
      data: null,
      error: { 
        message: error instanceof Error ? error.message : String(error)
      }
    };
  }
};

/**
 * Fallback method when Supabase client fails with split error
 * Attempts to manually exchange the code for a token
 */
const attemptManualTokenExchange = async (code: string) => {
  console.log('🔄 Attempting manual token exchange...');
  
  try {
    // Clear existing session
    await supabase.auth.signOut();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get Supabase URL and anon key from environment
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }
    
    // Direct API call to Supabase
    console.log('🔄 Making direct API call to Supabase auth endpoint...');
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        auth_code: code,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Manual token exchange failed:', errorData);
      return {
        data: null,
        error: { message: `Manual exchange failed: ${errorData.error || response.statusText}` }
      };
    }
    
    const tokenData = await response.json();
    console.log('✅ Manual token exchange successful');
    
    // Set session manually if successful
    if (tokenData.access_token) {
      console.log('🔄 Setting session with obtained tokens...');
      const sessionResult = await supabase.auth.setSession({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
      });
      
      return sessionResult;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    console.error('❌ Manual token exchange failed:', error);
    return {
      data: null,
      error: { 
        message: error instanceof Error ? error.message : String(error)
      }
    };
  }
};