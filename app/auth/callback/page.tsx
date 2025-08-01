'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleOAuthCallback, clearAuthState, validateSession } from '@/src/lib/authSimple';
import { debugCallback, debugAuthFlow } from '@/src/lib/authDebug';
import { validateAuthCode, sanitizeErrorMessage } from '@/src/lib/authUtils';

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

        // Debug current state
        if (process.env.NODE_ENV === 'development') {
          debugAuthFlow();
          debugCallback(searchParams);
        }

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

        if (code) {
          console.log('🔧 Authorization code received:', {
            length: code.length,
            preview: code.substring(0, 20) + '...'
          });
        } else {
          console.log('ℹ️ No authorization code in URL - will try session detection');
        }

        console.log('🔄 Using simplified OAuth callback handling...');
        console.log('🔧 Code details:', {
          length: code.length,
          preview: code.substring(0, 20) + '...',
          hasSpecialChars: /[^a-zA-Z0-9\-_]/.test(code)
        });

        // Use simplified OAuth handling
        const authResult = await handleOAuthCallback();

        if (authResult.success && authResult.session) {
          console.log(`✅ OAuth callback successful with method: ${authResult.method}`);

          // Clear timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Validate session
          const isValid = await validateSession();

          if (isValid) {
            console.log('✅ Session validated successfully');
            router.replace('/?success=login');
            return;
          } else {
            console.error('❌ Session validation failed');
            await clearAuthState();
            router.replace('/?error=session_validation_failed&details=Session validation failed');
            return;
          }
        } else {
          console.error('❌ OAuth callback failed:', authResult.error);

          // Clear timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Clear auth state and redirect with error
          await clearAuthState();

          const errorMessage = authResult.error || 'OAuth callback failed';
          router.replace(`/?error=callback_failed&details=${encodeURIComponent(errorMessage)}`);
          return;
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
