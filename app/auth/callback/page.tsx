'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let processed = false;

    const processCallback = async () => {
      if (processed) return;
      processed = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Simple auth callback processing...');
      }

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ OAuth error:', error);
          }
          router.replace(`/?error=auth_failed&details=${encodeURIComponent(error)}`);
          return;
        }

        if (!code) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ No authorization code');
          }
          router.replace('/?error=no_code');
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Exchanging code for session...');
        }
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('❌ Exchange error:', exchangeError);
          router.replace(`/?error=session_failed&details=${encodeURIComponent(exchangeError.message)}`);
          return;
        }

        if (!data?.session) {
          console.error('❌ No session received');
          router.replace('/?error=session_failed&details=No session data');
          return;
        }

        console.log('✅ Session created successfully:', {
          user: data.session.user?.email,
          expires: data.session.expires_at
        });

        // 🚀 CRITICAL FIX: Force session persistence
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        // Wait a bit for session to be stored
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user is admin and redirect accordingly
        try {
          const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

          if (adminError) {
            console.warn('⚠️ Admin check failed:', adminError);
          }

          // Get redirect URL from query params
          const redirectTo = searchParams.get('redirectTo');

          let redirectUrl = '/';
          if (redirectTo && redirectTo.startsWith('/admin') && isAdmin) {
            redirectUrl = redirectTo;
          } else if (isAdmin && !redirectTo) {
            redirectUrl = '/admin';
          }

          console.log('🔄 Redirecting to:', redirectUrl);

          // 🚀 CRITICAL FIX: Longer delay to ensure session is stored
          setTimeout(() => {
            router.replace(`${redirectUrl}?success=login`);
          }, 1500);

        } catch (adminCheckError) {
          console.warn('⚠️ Admin check error:', adminCheckError);
          setTimeout(() => {
            router.replace('/?success=login');
          }, 1500);
        }

      } catch (err) {
        console.error('❌ Callback error:', err);
        router.replace(`/?error=callback_failed&details=${encodeURIComponent(String(err))}`);
      }
    };

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-casino-dark text-white gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green" />
      <p className="text-lg">Processing login...</p>
      <p className="text-sm text-gray-400">Please wait...</p>
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
