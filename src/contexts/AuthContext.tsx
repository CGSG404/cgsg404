"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

type User = SupabaseUser;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk login dengan Google
  const signInWithGoogle = async () => {
    // Prevent multiple simultaneous sign-in attempts
    if (loading) {
      console.log('⚠️ Sign in already in progress, skipping...');
      return;
    }

    try {
      setLoading(true);

      // Ensure we're using the correct domain for production
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.gurusingapore.com';
      const redirectUrl = `${baseUrl}/auth/callback`;

      console.log('🚀 Starting Google OAuth with redirect:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
          // Add scopes for better OAuth flow
          scopes: 'openid email profile',
        },
      });

      if (error) {
        console.error('❌ OAuth initiation error:', error);
        throw error;
      }

      console.log('✅ OAuth initiated successfully:', data);
      // Don't set loading to false here - let the redirect handle it
    } catch (error) {
      console.error('❌ Error signing in with Google:', error);
      setLoading(false); // Only set loading false on error
      throw error;
    }
  };

  // Fungsi untuk logout
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    let mounted = true;
    let subscription: any = null;
    let isInitialized = false;

    // Check initial session
    const getInitialSession = async () => {
      if (isInitialized) return; // Prevent multiple initializations

      try {
        console.log('🔍 Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error getting initial session:', error);
          // Don't throw, just log and continue
        } else {
          console.log('✅ Initial session:', session?.user ? 'User found' : 'No user');
        }

        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);
          isInitialized = true;
        }
      } catch (error) {
        console.error('❌ Exception getting initial session:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
          isInitialized = true;
        }
      }
    };

    // Setup auth state listener
    const setupAuthListener = () => {
      try {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔄 Auth state changed:', event, session?.user ? 'User present' : 'No user');

            // Skip INITIAL_SESSION event to prevent double initialization
            if (event === 'INITIAL_SESSION') {
              console.log('⏭️ Skipping INITIAL_SESSION event');
              return;
            }

            if (!mounted) {
              console.log('⚠️ Component unmounted, skipping auth state change');
              return;
            }

            try {
              // Batch state updates to prevent multiple re-renders
              setUser(session?.user || null);
              setLoading(false);

              // Additional logging for debugging
              if (event === 'SIGNED_IN') {
                console.log('✅ User signed in successfully:', session?.user?.email);
              } else if (event === 'SIGNED_OUT') {
                console.log('👋 User signed out');
                // Clear any cached data
                setUser(null);
              } else if (event === 'TOKEN_REFRESHED') {
                console.log('🔄 Token refreshed');
              }
            } catch (error) {
              console.error('❌ Error in auth state change handler:', error);
              if (mounted) {
                setLoading(false);
              }
            }
          }
        );

        subscription = data.subscription;
        console.log('🎧 Auth listener setup complete');
      } catch (error) {
        console.error('❌ Error setting up auth listener:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize in sequence
    const initialize = async () => {
      await getInitialSession();
      setupAuthListener();
    };

    initialize();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up AuthContext');
      mounted = false;
      isInitialized = false;
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
