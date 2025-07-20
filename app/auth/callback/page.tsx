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

        console.log('Auth callback params:', { code, error, errorDescription });

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          router.replace('/?error=auth_failed');
          return;
        }

        if (code) {
          console.log('Exchanging code for session...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Failed to exchange code for session:', exchangeError);
            router.replace('/?error=session_failed');
            return;
          }

          console.log('Session exchange successful:', data);
          
          // Wait a bit for the auth state to propagate
          setTimeout(() => {
            router.replace('/');
          }, 1000);
        } else {
          console.log('No code parameter, redirecting to home');
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/?error=callback_failed');
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
