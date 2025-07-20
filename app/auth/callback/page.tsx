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

      console.log('🚀 Simple auth callback processing...');

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('❌ OAuth error:', error);
          router.replace(`/?error=auth_failed&details=${encodeURIComponent(error)}`);
          return;
        }

        if (!code) {
          console.error('❌ No authorization code');
          router.replace('/?error=no_code');
          return;
        }

        console.log('🔄 Exchanging code for session...');
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

        console.log('✅ Session created successfully');
        
        // Simple redirect with minimal delay
        setTimeout(() => {
          router.replace('/?success=login');
        }, 500);

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
