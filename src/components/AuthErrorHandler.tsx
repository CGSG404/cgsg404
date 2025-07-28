'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { clearRecoveryState, isInRecoveryMode } from '@/src/lib/errorHandler';

export default function AuthErrorHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      // Safe parameter extraction with fallback
      let error: string | null = null;
      let details: string | null = null;
      let success: string | null = null;

      try {
        error = searchParams.get('error');
        details = searchParams.get('details');
        success = searchParams.get('success');
      } catch (paramError) {
        console.error('❌ Failed to parse URL parameters:', paramError);
        return; // Exit early if we can't parse parameters
      }

    if (success === 'login') {
      toast.success('Successfully signed in!', {
        description: 'Welcome back to CGSG',
        duration: 3000,
      });
    } else if (error) {
      let title = 'Authentication Error';
      let description = 'Please try again';

      switch (error) {
        case 'auth_failed':
          title = 'Google Sign In Failed';
          description = details || 'Failed to authenticate with Google';
          break;
        case 'session_failed':
          title = 'Session Creation Failed';
          description = details || 'Failed to create user session';
          break;
        case 'session_set_failed':
          title = 'Session Setup Error';
          description = details || 'Failed to set up your session. Please try again.';
          break;
        case 'session_validation_failed':
          title = 'Session Validation Error';
          description = details || 'Session could not be validated. Please try again.';
          break;
        case 'callback_failed':
          title = 'Authentication Callback Failed';
          description = details || 'Error processing authentication response';
          break;
        case 'callback_timeout':
          title = 'Authentication Timeout';
          description = 'The authentication process took too long. Please try again.';
          break;
        case 'no_code':
          title = 'Authentication Incomplete';
          description = 'No authorization code received from Google';
          break;
        case 'invalid_code':
          title = 'Invalid Authorization Code';
          description = 'The authorization code format is invalid. Please try again.';
          break;
        case 'auth_retry':
          title = 'Please Try Again';
          description = details || 'OAuth data format issue detected. Please try signing in again.';
          break;
        case 'auth_recovery':
          title = 'Authentication Recovered';
          description = details || 'Authentication error was recovered. Please try logging in again.';
          break;
        case 'client_exception':
          title = 'Application Error Recovered';
          description = details || 'A client-side error was recovered. Please try again.';
          break;
        default:
          description = details || 'Unknown authentication error';
      }

      // Show different toast types for recovery messages
      if (error === 'auth_recovery' || error === 'client_exception') {
        toast.warning(title, {
          description,
          duration: 5000,
          action: {
            label: 'Try Login',
            onClick: () => window.location.href = '/signin',
          },
        });
      } else {
        toast.error(title, {
          description,
          duration: 5000,
          action: {
            label: 'Try Again',
            onClick: () => window.location.href = '/signin',
          },
        });
      }

      // Log for debugging
      console.error('🚨 Auth Error:', { error, details, title, description });
    }

      // Clear URL parameters after showing the message
      if (error || success) {
        setTimeout(() => {
          clearRecoveryState();
        }, 1000); // Give time for toast to show
      }
    } catch (handlerError) {
      console.error('❌ AuthErrorHandler error:', handlerError);
      // Fallback: just clear the URL
      setTimeout(() => {
        try {
          clearRecoveryState();
        } catch (clearError) {
          console.error('❌ Failed to clear recovery state:', clearError);
        }
      }, 1000);
    }
  }, [searchParams]);

  // Check if we're in recovery mode and log it
  useEffect(() => {
    if (isInRecoveryMode()) {
      console.log('🔄 Application is in recovery mode');
    }
  }, []);

  return null;
}
