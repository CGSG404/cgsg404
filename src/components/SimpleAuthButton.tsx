'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

export default function SimpleAuthButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Simple Google login...');
      }

      // Get redirect parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo');

      // 🔧 DEVELOPMENT FIX: Force localhost redirect in development
      const redirectOrigin = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : window.location.origin;

      // Build callback URL with redirect parameter
      let callbackUrl = `${redirectOrigin}/auth/callback`;
      if (redirectTo) {
        callbackUrl += `?redirectTo=${encodeURIComponent(redirectTo)}`;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 OAuth callback URL:', callbackUrl);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent select_account', // 🔧 Force consent screen & account selection
          },
          scopes: 'openid email profile', // 🔧 Explicit scopes
        },
      });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ OAuth error:', error);
        }
        alert(`Login error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ OAuth initiated');
      }
      // Loading will be handled by redirect
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Login error:', err);
      }
      alert(`Login error: ${String(err)}`);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark px-6 py-2 rounded-lg disabled:opacity-50 font-semibold transition-all duration-200"
    >
      {loading ? 'Signing in...' : 'Simple Google Login'}
    </button>
  );
}
