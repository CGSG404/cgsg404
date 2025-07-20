import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useAuth } from '@/src/contexts/AuthContext';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

const Auth = () => {
// Semua logic dan UI utama Auth sudah di sini.

  const { user, signInWithGoogle, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      // Add safety check for window object
      if (typeof window === 'undefined') {
        console.error('Window object not available');
        toast.error('Browser environment not ready');
        return;
      }

      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);

      // More specific error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('popup') || errorMessage.includes('blocked')) {
        toast.error('Popup blocked. Please allow popups and try again.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-casino-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-casino-card-bg border-casino-border-subtle">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text">
            Sign In to CGSG
          </CardTitle>
          <CardDescription className="text-gray-400">
            Continue with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button
            type="button"
            variant="outline"
            className="w-full bg-casino-dark border-casino-border-subtle text-white hover:bg-casino-dark/90"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <div className="mt-4 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <a href="/privacy" className="text-casino-primary hover:underline">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
