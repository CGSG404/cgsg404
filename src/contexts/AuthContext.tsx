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

  // Fungsi untuk login dengan Google - SIMPLIFIED
  const signInWithGoogle = async () => {
    if (loading) {
      console.log('⚠️ Sign in already in progress');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Starting Google OAuth...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('❌ OAuth error:', error);
        setLoading(false);
        throw error;
      }

      console.log('✅ OAuth initiated');
      // Loading will be handled by redirect
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setLoading(false);
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

  // Handle auth state changes - SIMPLIFIED VERSION
  useEffect(() => {
    let mounted = true;
    let subscription: any = null;
    let hasInitialized = false;

    console.log('🚀 AuthContext: Starting initialization...');

    // Single initialization function
    const initializeAuth = async () => {
      if (hasInitialized) {
        console.log('⚠️ Auth already initialized, skipping...');
        return;
      }

      try {
        hasInitialized = true;
        console.log('🔍 Getting initial session...');

        const { data: { session }, error } = await supabase.auth.getSession();

        if (mounted) {
          if (error) {
            console.error('❌ Initial session error:', error);
            setUser(null);
          } else {
            console.log('✅ Initial session result:', session?.user ? 'User found' : 'No user');
            setUser(session?.user || null);
          }
          setLoading(false);
        }

        // Setup listener AFTER initial session is handled
        if (mounted) {
          console.log('🎧 Setting up auth listener...');
          const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`🔄 Auth event: ${event}`, session?.user ? 'User present' : 'No user');

            // Only handle specific events to prevent loops
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
              if (mounted) {
                setUser(session?.user || null);
                console.log(`✅ Auth state updated for event: ${event}`);
              }
            }
          });

          subscription = data.subscription;
          console.log('✅ Auth listener setup complete');
        }

      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Start initialization
    initializeAuth();

    // Cleanup function
    return () => {
      console.log('🧹 AuthContext cleanup');
      mounted = false;
      hasInitialized = false;
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.warn('⚠️ Error unsubscribing:', error);
        }
        subscription = null;
      }
    };
  }, []); // Empty dependency array - only run once

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
