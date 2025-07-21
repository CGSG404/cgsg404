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

      // Build callback URL with redirect parameter
      let callbackUrl = `${window.location.origin}/auth/callback`;
      if (redirectTo) {
        callbackUrl += `?redirectTo=${encodeURIComponent(redirectTo)}`;
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
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Simple Google Login'}
    </button>
  );
}
