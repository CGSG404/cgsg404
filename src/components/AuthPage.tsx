import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import SimpleAuthButton from '@/src/components/SimpleAuthButton';

const Auth = () => {
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
          <SimpleAuthButton />
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
