'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';
import { safeExchangeCodeForSession, validateAuthCode } from '@/src/lib/authWorkaround';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Prevent multiple executions and infinite loops
    if (processedRef.current) {
      console.log('🔄 Callback already processed, skipping...');
      return;
    }

    // Set timeout to prevent hanging
    timeoutRef.current = setTimeout(() => {
      console.error('⏰ Callback timeout - redirecting to home');
      router.replace('/?error=callback_timeout');
    }, 30000); // 30 second timeout

    const processCallback = async () => {
      try {
        processedRef.current = true;

        console.log('🚀 Auth callback processing started...');

        // Check for redirect loops by examining URL length
        const currentUrl = window.location.href;
        if (currentUrl.length > 2000) {
          console.error('❌ Detected potential redirect loop - URL too long');
          // Clear any auth state and redirect to clean home
          await supabase.auth.signOut();
          router.replace('/');
          return;
        }

        // Debug: Log all URL parameters safely
        const allParams = searchParams ? Object.fromEntries(searchParams.entries()) : {};
        console.log('🔍 URL params count:', Object.keys(allParams).length);

        // Only log first few params to avoid console spam
        const limitedParams = Object.fromEntries(
          Object.entries(allParams).slice(0, 5)
        );
        console.log('🔍 First few params:', limitedParams);

        const code = searchParams?.get('code');
        const error = searchParams?.get('error');

        if (error) {
          console.error('❌ OAuth error:', error);
          // Clear timeout since we're handling the error
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          const safeError = String(error || 'OAuth error').substring(0, 100);
          router.replace(`/?error=auth_failed&details=${encodeURIComponent(safeError)}`);
          return;
        }

        if (!code) {
          console.error('❌ No authorization code found');
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          router.replace('/?error=no_code');
          return;
        }

        // Validate authorization code format
        if (!validateAuthCode(code)) {
          console.error('❌ Invalid authorization code format');
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          router.replace('/?error=invalid_code');
          return;
        }

        console.log('🔄 Exchanging code for session...');
        console.log('🔧 Code length:', code.length);

        let data, exchangeError;
        try {
          console.log('🔄 Using safe exchange method...');

          // Use the safe exchange method that handles split errors
          const result = await safeExchangeCodeForSession(code);
          data = result.data;
          exchangeError = result.error;

          console.log('🔍 Safe exchange result:', {
            hasData: !!data,
            hasError: !!exchangeError,
            sessionExists: !!data?.session
          });

        } catch (exchangeException) {
          console.error('❌ Safe exchange exception:', exchangeException);

          // Clear timeout since we're handling the error
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Check for specific errors
          let errorMessage = 'Exchange failed';
          if (exchangeException instanceof Error) {
            if (exchangeException.message.includes('split')) {
              errorMessage = 'OAuth data format error detected';
              console.log('🔧 Split error detected - will attempt recovery');
            } else if (exchangeException.message.includes('timeout')) {
              errorMessage = 'Authentication timeout';
            } else {
              errorMessage = exchangeException.message.substring(0, 200);
            }
          }

          exchangeError = { message: errorMessage };
        }

        if (exchangeError) {
          console.error('❌ Exchange error:', exchangeError);

          // Clear timeout since we're handling the error
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Check if this is a split function error
          const errorString = String(exchangeError.message || exchangeError || '');
          if (errorString.includes('split') || errorString.includes('intermediate value')) {
            console.log('🔧 Detected Supabase split error, attempting recovery...');

            try {
              // Clear any problematic auth state
              await supabase.auth.signOut();

              // Wait a moment for cleanup
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Redirect to clean home page with retry message
              router.replace('/?error=auth_retry&message=Please try signing in again');
              return;
            } catch (recoveryError) {
              console.error('❌ Recovery attempt failed:', recoveryError);
              router.replace('/?error=auth_failed');
              return;
            }
          }

          // Extract safe error message
          let safeMessage = 'Session exchange failed';
          try {
            if (exchangeError && typeof exchangeError === 'object') {
              safeMessage = (exchangeError as any).message || (exchangeError as any).error_description || 'Unknown error';
            } else if (typeof exchangeError === 'string') {
              safeMessage = exchangeError;
            }
          } catch (parseError) {
            console.error('❌ Error parsing exchange error:', parseError);
            safeMessage = 'Session exchange failed';
          }

          // Limit message length to prevent URL issues
          const finalMessage = String(safeMessage).substring(0, 100);
          router.replace(`/?error=session_failed&details=${encodeURIComponent(finalMessage)}`);
          return;
        }

        if (!data?.session) {
          console.error('❌ No session received');
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          router.replace('/?error=session_failed&details=No session data');
          return;
        }

        console.log('✅ Session created successfully:', {
          user: data.session.user?.email,
          expires: data.session.expires_at
        });

        // Clear timeout since we're proceeding successfully
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set session explicitly for better persistence
        console.log('🔧 Setting session explicitly...');
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        if (setSessionError) {
          console.error('❌ Failed to set session:', setSessionError);
          const errorMsg = setSessionError.message.substring(0, 100);
          router.replace(`/?error=session_set_failed&details=${encodeURIComponent(errorMsg)}`);
          return;
        }

        // Quick validation with shorter timeout
        await new Promise(resolve => setTimeout(resolve, 300));

        const { data: { session: validationSession }, error: validationError } = await supabase.auth.getSession();

        if (validationError || !validationSession) {
          console.error('❌ Session validation failed:', validationError);
          // One quick retry
          await new Promise(resolve => setTimeout(resolve, 500));

          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (!retrySession) {
            console.error('❌ Session still not available after retry');
            router.replace('/?error=session_validation_failed');
            return;
          }
        }

        console.log('✅ Session validated successfully');

        // Successful authentication - redirect to home
        console.log('✅ Session validated, redirecting to home...');

        // Simple, clean redirect to prevent loops
        const redirectUrl = '/';
        console.log('🔄 Redirecting to:', redirectUrl);

        // Use immediate redirect to prevent any timing issues
        try {
          router.replace(`${redirectUrl}?success=login`);
        } catch (redirectError) {
          console.error('❌ Redirect error:', redirectError);
          // Fallback: simple redirect
          try {
            router.replace(redirectUrl);
          } catch (fallbackError) {
            console.error('❌ Fallback redirect failed:', fallbackError);
            // Last resort: force page reload
            window.location.href = redirectUrl;
          }
        }

      } catch (err) {
        console.error('❌ Callback error:', err);

        // Clear timeout since we're handling the error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Extract safe error message
        let errorMessage = 'Authentication error';
        try {
          if (err instanceof Error) {
            errorMessage = err.message.substring(0, 100);
          } else if (typeof err === 'string') {
            errorMessage = err.substring(0, 100);
          }
        } catch (extractionError) {
          console.error('❌ Error during error message extraction:', extractionError);
          errorMessage = 'Error processing failed';
        }

        // Safe redirect with limited error message
        try {
          router.replace(`/?error=callback_failed&details=${encodeURIComponent(errorMessage)}`);
        } catch (redirectError) {
          console.error('❌ Redirect error:', redirectError);
          // Fallback redirect without details
          router.replace('/?error=callback_failed');
        }
      }
    };

    // Start processing
    processCallback();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
