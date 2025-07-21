'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { sessionFix } from '@/src/utils/sessionFix';
import { toast } from 'sonner';

function SessionFixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFixing, setIsFixing] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [fixAttempted, setFixAttempted] = useState(false);

  const error = searchParams.get('error');
  const redirectTo = searchParams.get('redirectTo');

  useEffect(() => {
    // Auto-check session on load
    checkSessionStatus();
  }, []);

  const checkSessionStatus = async () => {
    try {
      const info = await sessionFix.debugSession();
      setSessionInfo(info);
      
      if (info && info.hasSession && !info.isExpired) {
        toast.success('Session is healthy!');
        // If session is good, redirect back
        if (redirectTo) {
          setTimeout(() => {
            router.push(redirectTo);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const handleFixSession = async () => {
    setIsFixing(true);
    setFixAttempted(true);
    
    try {
      toast.info('Fixing session issues...');
      
      // Clear and refresh session
      await sessionFix.forceSessionRefresh();
      
    } catch (error) {
      console.error('Session fix error:', error);
      toast.error('Failed to fix session. Please try manually signing out and in.');
    } finally {
      setIsFixing(false);
    }
  };

  const handleManualSignIn = () => {
    const signInUrl = redirectTo 
      ? `/signin?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/signin';
    router.push(signInUrl);
  };

  const getErrorMessage = () => {
    switch (error) {
      case 'session_refresh_needed':
        return 'Your session needs to be refreshed. This can happen after extended periods of inactivity.';
      case 'middleware_error':
        return 'There was an error validating your session. Please refresh your authentication.';
      case 'admin_access_denied':
        return 'Admin access was denied. Your session may have expired or admin privileges may have changed.';
      default:
        return 'There seems to be an issue with your authentication session.';
    }
  };

  const getSessionStatusIcon = () => {
    if (!sessionInfo) return <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />;
    
    if (sessionInfo.hasSession && !sessionInfo.isExpired) {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
    
    return <XCircle className="w-6 h-6 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-casino-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-casino-card-bg border-casino-border-subtle">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl gradient-text">
            Session Issue Detected
          </CardTitle>
          <CardDescription className="text-gray-400">
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Session Status */}
          <div className="bg-casino-dark/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Session Status</span>
              {getSessionStatusIcon()}
            </div>
            
            {sessionInfo && (
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Has Session:</span>
                  <span className={sessionInfo.hasSession ? 'text-green-400' : 'text-red-400'}>
                    {sessionInfo.hasSession ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Is Expired:</span>
                  <span className={sessionInfo.isExpired ? 'text-red-400' : 'text-green-400'}>
                    {sessionInfo.isExpired ? 'Yes' : 'No'}
                  </span>
                </div>
                {sessionInfo.userEmail && (
                  <div className="flex justify-between">
                    <span>User:</span>
                    <span className="text-blue-400">{sessionInfo.userEmail}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleFixSession}
              disabled={isFixing}
              className="w-full bg-casino-neon-green text-casino-dark hover:opacity-90"
            >
              {isFixing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Fixing Session...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Fix Session Automatically
                </>
              )}
            </Button>

            <Button
              onClick={handleManualSignIn}
              variant="outline"
              className="w-full border-casino-border-subtle hover:bg-casino-dark text-white"
            >
              Sign In Manually
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Go to Home
            </Button>
          </div>

          {/* Debug Info (Development Only) */}
          {process.env.NODE_ENV === 'development' && sessionInfo && (
            <details className="bg-casino-dark/30 rounded p-3">
              <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
              <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                {JSON.stringify(sessionInfo, null, 2)}
              </pre>
            </details>
          )}

          {fixAttempted && (
            <div className="text-center text-xs text-gray-400">
              If the automatic fix doesn't work, try clearing your browser cache and cookies.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SessionFixPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-casino-dark flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-casino-card-bg border-casino-border-subtle">
          <CardContent className="flex items-center justify-center p-8">
            <RefreshCw className="w-8 h-8 animate-spin text-casino-neon-green" />
          </CardContent>
        </Card>
      </div>
    }>
      <SessionFixContent />
    </Suspense>
  );
}
