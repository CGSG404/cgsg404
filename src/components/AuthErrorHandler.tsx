'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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
        default:
          description = details || 'Unknown authentication error';
      }

      toast.error(title, {
        description,
        duration: 5000,
        action: {
          label: 'Try Again',
          onClick: () => window.location.href = '/signin',
        },
      });

      // Log for debugging
      console.error('🚨 Auth Error:', { error, details, title, description });
    }
  }, [searchParams]);

  return null;
}
