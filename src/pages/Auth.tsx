
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

const Auth = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google');
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
