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

        // 🚀 PRODUCTION FIX: Enhanced session persistence with validation
        console.log('🔧 Setting session explicitly...');
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        if (setSessionError) {
          console.error('❌ Failed to set session:', setSessionError);
          router.replace(`/?error=session_set_failed&details=${encodeURIComponent(setSessionError.message)}`);
          return;
        }

        // 🔧 Validate session was stored correctly
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: { session: validationSession }, error: validationError } = await supabase.auth.getSession();

        if (validationError || !validationSession) {
          console.error('❌ Session validation failed:', validationError);
          // Try one more time with longer delay
          await new Promise(resolve => setTimeout(resolve, 1500));

          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (!retrySession) {
            console.error('❌ Session still not available after retry');
            router.replace('/?error=session_validation_failed&details=Session not persisted');
            return;
          }
        }

        console.log('✅ Session validated successfully');

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

          // 🚀 PRODUCTION FIX: Optimized redirect with session confirmation
          // Use shorter delay since we already validated session above
          setTimeout(() => {
            router.replace(`${redirectUrl}?success=login&timestamp=${Date.now()}`);
          }, 500);

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
