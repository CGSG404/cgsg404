"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useNotificationHelpers } from '../components/ui/notification';
import { authLogger } from '@/src/utils/logger';

type User = SupabaseUser;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  // Debug info (optional)
  debugInfo?: {
    initCount: number;
    lastEvent: string;
    lastUpdate: Date;
  };
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// NEW: Auth Error Boundary Component
export const AuthErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('AuthContext') ||
          event.error?.message?.includes('useAuth')) {
        authLogger.criticalError('Auth Error Boundary caught:', event.error);
        setHasError(true);
        setError(event.error);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Auth System Error</h2>
          <p className="text-gray-400 mb-4">The authentication system encountered an error.</p>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="bg-casino-primary hover:bg-casino-primary/80 px-4 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notification helpers
  const notifications = useNotificationHelpers();

  // Debug tracking
  const initCountRef = useRef(0);
  const lastEventRef = useRef('none');
  const lastUpdateRef = useRef(new Date());
  const mountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);

  // Clear error when user changes
  useEffect(() => {
    if (user) {
      setError(null);
    }
  }, [user]);

  // Simplified Google sign in with forced consent
  const signInWithGoogle = async () => {
    if (loading) {
      authLogger.debug('Auth: Sign in already in progress');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      authLogger.debug('Auth: Starting Google OAuth with forced consent...');

      // 🚀 PRODUCTION FIX: Enhanced OAuth flow with better error handling
      authLogger.debug('Clearing existing sessions...');
      await supabase.auth.signOut();

      // Clear Supabase session properly - no localStorage manipulation needed
      authLogger.debug('Session cleared via Supabase');

      authLogger.debug('Starting OAuth flow...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent select_account',
            include_granted_scopes: 'false',
          },
          scopes: 'openid email profile',
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        authLogger.error('Auth: OAuth error:', error);
        setError(error.message);
        setLoading(false);

        // Show error notification
        notifications.error(
          'Login Failed',
          error.message || 'Unable to sign in with Google. Please try again.',
          { duration: 6000 }
        );

        throw error;
      }

      authLogger.debug('Auth: OAuth initiated successfully');
      // Loading state will be handled by redirect
    } catch (error) {
      authLogger.error('Auth: Sign in error:', error);
      setError(error instanceof Error ? error.message : 'Sign in failed');
      setLoading(false);

      // Show error notification
      notifications.error(
        'Login Error',
        error instanceof Error ? error.message : 'An unexpected error occurred during login',
        { duration: 6000 }
      );

      throw error;
    }
  };

  // Simplified sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      authLogger.debug('Auth: Signing out...');

      await supabase.auth.signOut();
      setUser(null);

      authLogger.debug('Auth: Signed out successfully');

      // Show logout notification
      notifications.success(
        'Logged Out Successfully',
        'You have been safely logged out. See you next time!',
        { duration: 4000 }
      );
    } catch (error) {
      authLogger.error('Auth: Sign out error:', error);
      setError(error instanceof Error ? error.message : 'Sign out failed');

      // Show error notification
      notifications.error(
        'Logout Failed',
        error instanceof Error ? error.message : 'An error occurred during logout',
        { duration: 6000 }
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // SIMPLIFIED: Single useEffect for auth initialization
  useEffect(() => {
    let isMounted = true;
    initCountRef.current += 1;
    const currentInit = initCountRef.current;

    authLogger.debug(`Auth: Initialization #${currentInit} starting...`);

    const initializeAuth = async () => {
      try {
        // Get initial session
        authLogger.debug('Auth: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) {
          authLogger.debug('Auth: Component unmounted during init, aborting...');
          return;
        }

        if (error) {
          authLogger.error('Auth: Initial session error:', error);
          setError(error.message);
          setUser(null);
        } else {
          authLogger.debug('Auth: Initial session:', session?.user ? 'User found' : 'No user');
          if (session?.user) {
            authLogger.debug('Auth: User details:', { id: session.user.id, email: session.user.email });
          }
          setUser(session?.user || null);
          lastEventRef.current = 'initial_session';
          lastUpdateRef.current = new Date();
        }

        authLogger.debug('Auth: Setting loading to false');
        setLoading(false);

        // Setup auth state listener
        authLogger.debug('Auth: Setting up state listener...');
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) {
            authLogger.debug('Auth: Received event but component unmounted, ignoring...');
            return;
          }

          authLogger.debug(`Auth: Event received - ${event}`, session?.user ? 'User present' : 'No user');

          // Update state based on event
          lastEventRef.current = event;
          lastUpdateRef.current = new Date();

          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
            const previousUser = user;
            setUser(session?.user || null);
            setError(null);
            authLogger.debug(`Auth: State updated for ${event}`);

            // Show login notification only for new sign-ins (not token refresh)
            if (event === 'SIGNED_IN' && session?.user && !previousUser) {
              const userName = session.user.user_metadata?.full_name ||
                              session.user.user_metadata?.name ||
                              session.user.email?.split('@')[0] ||
                              'User';

              notifications.success(
                'Welcome Back!',
                `Hello ${userName}, you have successfully logged in.`,
                { duration: 5000 }
              );
            }
          }
        });

        subscriptionRef.current = data.subscription;
        authLogger.debug('Auth: Listener setup complete');

      } catch (error) {
        authLogger.error('Auth: Initialization error:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Auth initialization failed');
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      authLogger.debug(`Auth: Cleanup for init #${currentInit}`);
      isMounted = false;
      mountedRef.current = false;

      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
          authLogger.debug('Auth: Subscription cleaned up');
        } catch (error) {
          authLogger.warn('Auth: Error during cleanup:', error);
        }
        subscriptionRef.current = null;
      }
    };
  }, []); // Empty dependency array - run only once

  // Debug info for development
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    initCount: initCountRef.current,
    lastEvent: lastEventRef.current,
    lastUpdate: lastUpdateRef.current,
  } : undefined;

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    debugInfo,
  };

  return (
    <AuthErrorBoundary>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </AuthErrorBoundary>
  );
};
