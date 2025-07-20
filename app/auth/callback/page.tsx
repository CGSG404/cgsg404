'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';
import AuthErrorBoundary from '@/src/components/AuthErrorBoundary';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isProcessing = false; // Prevent multiple simultaneous processing

    const handleAuthCallback = async () => {
      if (isProcessing) {
        console.log('⚠️ Auth callback already processing, skipping...');
        return;
      }

      isProcessing = true;

      try {
        // Add safety check for window object
        if (typeof window === 'undefined') {
          console.log('⚠️ Window object not available, skipping callback');
          return;
        }

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

          try {
            // Use the built-in session handling from Supabase
            // This automatically handles PKCE flow
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
              console.error('❌ Exchange error:', error);

              // Handle specific PKCE errors
              if (error.message.includes('code_verifier') || error.message.includes('PKCE')) {
                console.log('🔄 PKCE error detected, trying session refresh...');

                // Try to refresh the session
                const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

                if (refreshError || !refreshData?.session) {
                  console.error('❌ Session refresh failed:', refreshError);
                  router.replace(`/?error=session_failed&details=${encodeURIComponent('PKCE verification failed. Please try logging in again.')}`);
                  return;
                }

                console.log('✅ Session refreshed successfully');
                router.replace('/?success=login');
                return;
              }

              router.replace(`/?error=session_failed&details=${encodeURIComponent(error.message)}`);
              return;
            }

            if (!data?.session) {
              console.error('❌ No session data received');
              router.replace(`/?error=session_failed&details=${encodeURIComponent('No session data received')}`);
              return;
            }

            console.log('✅ Session exchange successful:', {
              userId: data.session.user?.id,
              email: data.session.user?.email,
              expiresAt: data.session.expires_at
            });

            // Wait for auth state to propagate before redirecting
            console.log('⏳ Waiting for auth state to propagate...');
            setTimeout(() => {
              if (!isProcessing) return; // Check if still processing
              router.replace('/?success=login');
            }, 1500);

          } catch (err) {
            console.error('❌ Exchange exception:', err);
            router.replace(`/?error=callback_failed&details=${encodeURIComponent(err.message || 'Unknown error')}`);
          } finally {
            // Reset processing flag after a delay
            setTimeout(() => {
              isProcessing = false;
            }, 2000);
          }
        } else {
          console.log('⚠️ No code parameter, redirecting to home');
          router.replace('/?error=no_code');
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        router.replace(`/?error=callback_failed&details=${encodeURIComponent(error.message || 'Unknown error')}`);
        isProcessing = false;
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
    <AuthErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-casino-dark text-white gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green" />
          <p className="text-lg">Loading...</p>
        </div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </AuthErrorBoundary>
  );
}
