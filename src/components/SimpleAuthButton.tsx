'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

export default function SimpleAuthButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('🚀 Simple Google login...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('❌ OAuth error:', error);
        alert(`Login error: ${error.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ OAuth initiated');
      // Loading will be handled by redirect
    } catch (err) {
      console.error('❌ Login error:', err);
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
