"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
    try {
      setLoading(true);

      const redirectUrl = `${window.location.origin}/auth/callback`;
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
        },
      });

      if (error) {
        console.error('❌ OAuth initiation error:', error);
        throw error;
      }

      console.log('✅ OAuth initiated successfully:', data);
    } catch (error) {
      console.error('❌ Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
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

    // Check initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error getting initial session:', error);
        } else {
          console.log('✅ Initial session:', session?.user ? 'User found' : 'No user');
        }

        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Exception getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user ? 'User present' : 'No user');

        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);

          // Additional logging for debugging
          if (event === 'SIGNED_IN') {
            console.log('✅ User signed in successfully:', session?.user?.email);
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('🔄 Token refreshed');
          }
        }
      }
    );

    // Initial session check
    getInitialSession();

    // Cleanup
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
