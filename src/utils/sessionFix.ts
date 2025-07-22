// 🚀 PRODUCTION SESSION FIX UTILITY
// This utility helps fix session persistence issues in production

export const sessionFix = {
  // Clear all auth-related storage
  clearAuthStorage: () => {
    try {
      // Clear localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('auth') || key.includes('session') || key.includes('token') ||
                   key.includes('supabase') || key.startsWith('sb-'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear sessionStorage
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('auth') || key.includes('session') || key.includes('token') ||
                   key.includes('supabase') || key.startsWith('sb-'))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 Auth storage cleared:', {
          localStorage: keysToRemove,
          sessionStorage: sessionKeysToRemove
        });
      }
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  },

  // Force session refresh
  forceSessionRefresh: async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Sign out first
      await supabase.auth.signOut();
      
      // Clear storage
      sessionFix.clearAuthStorage();
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to signin
      window.location.href = '/signin?refresh=true';
    } catch (error) {
      console.error('Error forcing session refresh:', error);
      // Fallback: just redirect
      window.location.href = '/signin?refresh=true';
    }
  },

  // Check if session is valid
  checkSessionHealth: async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Session health check failed:', error);
        return false;
      }
      
      if (!session) {
        console.warn('No session found');
        return false;
      }
      
      // Check if session is expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.warn('Session expired');
        return false;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Session is healthy');
      }
      return true;
    } catch (error) {
      console.error('Session health check error:', error);
      return false;
    }
  },

  // Auto-fix session issues
  autoFix: async () => {
    const isHealthy = await sessionFix.checkSessionHealth();
    
    if (!isHealthy) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Auto-fixing session issues...');
      }
      await sessionFix.forceSessionRefresh();
    }
    
    return isHealthy;
  },

  // Debug session info
  debugSession: async () => {
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      const debugInfo = {
        hasSession: !!session,
        sessionError: error?.message,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        expiresAt: session?.expires_at,
        isExpired: session?.expires_at ? session.expires_at < Math.floor(Date.now() / 1000) : null,
        localStorage: {
          authToken: !!localStorage.getItem('sb-auth-token'),
          supabaseAuth: !!localStorage.getItem('supabase.auth.token')
        },
        sessionStorage: {
          authToken: !!sessionStorage.getItem('sb-auth-token'),
          supabaseAuth: !!sessionStorage.getItem('supabase.auth.token')
        }
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Session Debug Info:', debugInfo);
      }
      return debugInfo;
    } catch (error) {
      console.error('Debug session error:', error);
      return null;
    }
  }
};

// Auto-run session check on import in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Check session health after a short delay
  setTimeout(() => {
    sessionFix.debugSession();
  }, 2000);
}
