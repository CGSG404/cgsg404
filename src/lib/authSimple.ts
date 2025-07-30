// Simplified auth handling to avoid complex workarounds
import { supabase } from './supabaseClient';

export interface SimpleAuthResult {
  success: boolean;
  session?: any;
  error?: string;
  method?: string;
}

export const handleOAuthCallback = async (): Promise<SimpleAuthResult> => {
  console.log('🔄 Starting simple OAuth callback handling...');
  
  try {
    // Method 1: Let Supabase handle the callback automatically
    console.log('🔄 Method 1: Auto session detection...');
    
    // Wait for Supabase to process the URL
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session && !error) {
      console.log('✅ Method 1 successful - auto session detected');
      return {
        success: true,
        session: session,
        method: 'auto_detection'
      };
    }
    
    console.log('🔄 Method 1 failed, trying method 2...');
    
    // Method 2: Manual session refresh
    console.log('🔄 Method 2: Session refresh...');
    
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshData?.session && !refreshError) {
      console.log('✅ Method 2 successful - session refresh');
      return {
        success: true,
        session: refreshData.session,
        method: 'session_refresh'
      };
    }
    
    console.log('🔄 Method 2 failed, trying method 3...');
    
    // Method 3: Check for existing session with longer wait
    console.log('🔄 Method 3: Extended session check...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { data: { session: extendedSession }, error: extendedError } = await supabase.auth.getSession();
    
    if (extendedSession && !extendedError) {
      console.log('✅ Method 3 successful - extended session check');
      return {
        success: true,
        session: extendedSession,
        method: 'extended_check'
      };
    }
    
    console.log('🔄 Method 3 failed, trying method 4...');
    
    // Method 4: Force auth state change listener
    console.log('🔄 Method 4: Auth state listener...');
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          success: false,
          error: 'All methods failed - timeout',
          method: 'timeout'
        });
      }, 5000);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth state change:', event, !!session);
        
        if (session && event === 'SIGNED_IN') {
          clearTimeout(timeout);
          subscription.unsubscribe();
          
          console.log('✅ Method 4 successful - auth state change');
          resolve({
            success: true,
            session: session,
            method: 'auth_state_change'
          });
        }
      });
      
      // Trigger a potential state change
      setTimeout(() => {
        supabase.auth.getSession();
      }, 1000);
    });
    
  } catch (error) {
    console.error('❌ Simple auth callback failed:', error);
    return {
      success: false,
      error: `Simple auth failed: ${error instanceof Error ? error.message : String(error)}`,
      method: 'error'
    };
  }
};

export const clearAuthState = async (): Promise<void> => {
  console.log('🧹 Clearing auth state...');
  
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear storage
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

export const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Session validation error:', error);
      return false;
    }
    
    if (!session) {
      console.log('ℹ️ No session found');
      return false;
    }
    
    // Check if session is expired
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      console.log('⚠️ Session expired');
      return false;
    }
    
    console.log('✅ Session is valid');
    return true;
    
  } catch (error) {
    console.error('❌ Session validation failed:', error);
    return false;
  }
};

export const getAuthUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Get user error:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('❌ Get user failed:', error);
    return null;
  }
};
