import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

/**
 * This page is loaded after the browser is redirected back from Google OAuth.
 * It performs three things:
 * 1. Detect `?code=` (or `?error=`) in the query string.
 * 2. If `code` exists → exchange it for a Supabase session.
 * 3. Redirect the user to the home page (`/`) when done.
 */
export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Wait until the router has query params populated
    if (!router.isReady) return;

    const { code, error, error_description } = router.query;

    // Helper: ensure we always land on homepage afterwards
    const finish = () => router.replace('/');

    // If Google returned an error, log it and bounce
    if (error) {
      console.error('OAuth error:', error, error_description);
      finish();
      return;
    }

    // If we have a code parameter, exchange it for a session
    if (code && typeof code === 'string') {
      (async () => {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('Failed to exchange code for session:', exchangeError);
        }
        finish();
      })();
    } else {
      // No code nor error – just go home
      finish();
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-casino-dark text-white gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green" />
      <p className="text-lg">Finalizing login, please wait...</p>
    </div>
  );
}
