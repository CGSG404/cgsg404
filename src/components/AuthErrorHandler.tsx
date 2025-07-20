'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { clearRecoveryState, isInRecoveryMode } from '@/src/lib/errorHandler';

export default function AuthErrorHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const details = searchParams.get('details');
    const success = searchParams.get('success');

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
        case 'callback_failed':
          title = 'Authentication Callback Failed';
          description = details || 'Error processing authentication response';
          break;
        case 'no_code':
          title = 'Authentication Incomplete';
          description = 'No authorization code received from Google';
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
  }, [searchParams]);

  // Check if we're in recovery mode and log it
  useEffect(() => {
    if (isInRecoveryMode()) {
      console.log('🔄 Application is in recovery mode');
    }
  }, []);

  return null;
}
