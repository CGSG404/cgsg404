'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const state = searchParams.get('state');

        console.log('🔍 Auth callback params:', {
          code: code ? `${code.substring(0, 10)}...` : null,
          error,
          errorDescription,
          state,
          fullUrl: window.location.href
        });

        if (error) {
          console.error('❌ OAuth error:', error, errorDescription);
          router.replace(`/?error=auth_failed&details=${encodeURIComponent(errorDescription || error)}`);
          return;
        }

        if (code) {
          console.log('🔄 Exchanging code for session...');

          // Try multiple approaches for session exchange
          let sessionData = null;
          let exchangeError = null;

          // Method 1: Direct exchange
          try {
            const result = await supabase.auth.exchangeCodeForSession(code);
            sessionData = result.data;
            exchangeError = result.error;
            console.log('📊 Exchange result:', {
              success: !!sessionData?.session,
              error: exchangeError?.message
            });
          } catch (err) {
            console.error('❌ Exchange exception:', err);
            exchangeError = err;
          }

          // Method 2: If direct exchange fails, try getting session
          if (!sessionData?.session && !exchangeError) {
            console.log('🔄 Trying to get existing session...');
            try {
              const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();
              if (sessionResult?.session) {
                sessionData = sessionResult;
                console.log('✅ Found existing session');
              } else {
                exchangeError = sessionError || new Error('No session found');
              }
            } catch (err) {
              console.error('❌ Session check exception:', err);
              exchangeError = err;
            }
          }

          if (exchangeError || !sessionData?.session) {
            console.error('❌ Failed to get session:', exchangeError);
            router.replace(`/?error=session_failed&details=${encodeURIComponent(exchangeError?.message || 'Unknown error')}`);
            return;
          }

          console.log('✅ Session exchange successful:', {
            userId: sessionData.session.user?.id,
            email: sessionData.session.user?.email,
            expiresAt: sessionData.session.expires_at
          });

          // Wait for auth state to propagate
          setTimeout(() => {
            router.replace('/?success=login');
          }, 1500);
        } else {
          console.log('⚠️ No code parameter, redirecting to home');
          router.replace('/?error=no_code');
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        router.replace(`/?error=callback_failed&details=${encodeURIComponent(error.message || 'Unknown error')}`);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-casino-dark text-white gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green" />
      <p className="text-lg">Finalizing login, please wait...</p>
      <p className="text-sm text-gray-400">Processing authentication...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-casino-dark text-white gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green" />
        <p className="text-lg">Loading...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
