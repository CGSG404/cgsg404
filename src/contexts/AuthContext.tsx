"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
        console.error('🚨 Auth Error Boundary caught:', event.error);
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
      console.log('⚠️ Auth: Sign in already in progress');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Auth: Starting Google OAuth with forced consent...');

      // 🚀 PRODUCTION FIX: Enhanced OAuth flow with better error handling
      console.log('🧹 Clearing existing sessions...');
      await supabase.auth.signOut();

      // Clear all possible storage locations
      const keysToRemove = [
        'sb-auth-token',
        'sb-plhpubcmugqosexcgdhj-auth-token',
        'supabase.auth.token'
      ];

      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn(`Failed to clear ${key}:`, e);
        }
      });

      console.log('🚀 Starting OAuth flow...');
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
        },
      });

      if (error) {
        console.error('❌ Auth: OAuth error:', error);
        setError(error.message);
        setLoading(false);
        throw error;
      }

      console.log('✅ Auth: OAuth initiated successfully');
      // Loading state will be handled by redirect
    } catch (error) {
      console.error('❌ Auth: Sign in error:', error);
      setError(error instanceof Error ? error.message : 'Sign in failed');
      setLoading(false);
      throw error;
    }
  };

  // Simplified sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Auth: Signing out...');

      await supabase.auth.signOut();
      setUser(null);

      console.log('✅ Auth: Signed out successfully');
    } catch (error) {
      console.error('❌ Auth: Sign out error:', error);
      setError(error instanceof Error ? error.message : 'Sign out failed');
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

    console.log(`🚀 Auth: Initialization #${currentInit} starting...`);

    const initializeAuth = async () => {
      try {
        // Get initial session
        console.log('🔍 Auth: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) {
          console.log('⚠️ Auth: Component unmounted during init, aborting...');
          return;
        }

        if (error) {
          console.error('❌ Auth: Initial session error:', error);
          setError(error.message);
          setUser(null);
        } else {
          console.log('✅ Auth: Initial session:', session?.user ? 'User found' : 'No user');
          if (session?.user) {
            console.log('🔍 Auth: User details:', { id: session.user.id, email: session.user.email });
          }
          setUser(session?.user || null);
          lastEventRef.current = 'initial_session';
          lastUpdateRef.current = new Date();
        }

        console.log('🔍 Auth: Setting loading to false');
        setLoading(false);

        // Setup auth state listener
        console.log('🎧 Auth: Setting up state listener...');
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) {
            console.log('⚠️ Auth: Received event but component unmounted, ignoring...');
            return;
          }

          console.log(`🔄 Auth: Event received - ${event}`, session?.user ? 'User present' : 'No user');

          // Update state based on event
          lastEventRef.current = event;
          lastUpdateRef.current = new Date();

          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
            setUser(session?.user || null);
            setError(null);
            console.log(`✅ Auth: State updated for ${event}`);
          }
        });

        subscriptionRef.current = data.subscription;
        console.log('✅ Auth: Listener setup complete');

      } catch (error) {
        console.error('❌ Auth: Initialization error:', error);
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
      console.log(`🧹 Auth: Cleanup for init #${currentInit}`);
      isMounted = false;
      mountedRef.current = false;

      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
          console.log('✅ Auth: Subscription cleaned up');
        } catch (error) {
          console.warn('⚠️ Auth: Error during cleanup:', error);
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
