'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugAuthPage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [authLogs, setAuthLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuthLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    addLog('Debug page loaded');
    
    // Check session manually
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setSessionInfo(session);
        addLog(`Manual session check: ${session ? 'Session found' : 'No session'}`);
        if (error) addLog(`Session error: ${error.message}`);
      } catch (error) {
        addLog(`Session exception: ${error}`);
      }
    };

    checkSession();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth event: ${event} - ${session ? 'Session present' : 'No session'}`);
      setSessionInfo(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    addLog(`Auth context update: ${user ? `User: ${user.email}` : 'No user'} (loading: ${loading})`);
  }, [user, loading]);

  const handleTestSignIn = async () => {
    try {
      addLog('Starting Google sign in...');
      await signInWithGoogle();
    } catch (error) {
      addLog(`Sign in error: ${error}`);
    }
  };

  const handleTestSignOut = async () => {
    try {
      addLog('Starting sign out...');
      await signOut();
    } catch (error) {
      addLog(`Sign out error: ${error}`);
    }
  };

  const handleRefreshSession = async () => {
    try {
      addLog('Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        addLog(`Refresh error: ${error.message}`);
      } else {
        addLog('Session refreshed successfully');
        setSessionInfo(data.session);
      }
    } catch (error) {
      addLog(`Refresh exception: ${error}`);
    }
  };

  const handleTestSupabaseConnection = async () => {
    try {
      addLog('Testing Supabase connection...');
      const { data, error } = await supabase.from('admin_users').select('count').limit(1);
      if (error) {
        addLog(`Supabase connection error: ${error.message}`);
      } else {
        addLog('Supabase connection successful');
      }
    } catch (error) {
      addLog(`Supabase connection exception: ${error}`);
    }
  };

  const handleClearLogs = () => {
    setAuthLogs([]);
    addLog('Logs cleared');
  };

  const handleTestCookies = () => {
    addLog('🍪 Testing cookie functionality...');

    // Check if cookies are enabled
    const testCookie = 'test-cookie-' + Date.now();
    document.cookie = `${testCookie}=test-value; path=/; secure; samesite=lax`;

    // Try to read it back
    const cookieExists = document.cookie.includes(testCookie);

    if (cookieExists) {
      addLog('✅ Cookies are working properly');

      // Check cookie consent
      const consent = localStorage.getItem('cookie-consent');
      if (consent) {
        try {
          const parsed = JSON.parse(consent);
          addLog(`🍪 Cookie consent found: ${JSON.stringify(parsed)}`);
        } catch {
          addLog('⚠️ Cookie consent found but invalid JSON');
        }
      } else {
        addLog('⚠️ No cookie consent found - banner should appear');
      }

      // Clean up test cookie
      document.cookie = `${testCookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } else {
      addLog('❌ Cookies are not working - this may cause auth issues');
    }

    // Check localStorage and sessionStorage
    try {
      localStorage.setItem('test-storage', 'test');
      const localTest = localStorage.getItem('test-storage');
      localStorage.removeItem('test-storage');
      addLog(localTest ? '✅ localStorage working' : '❌ localStorage not working');
    } catch {
      addLog('❌ localStorage blocked or not available');
    }

    try {
      sessionStorage.setItem('test-session', 'test');
      const sessionTest = sessionStorage.getItem('test-session');
      sessionStorage.removeItem('test-session');
      addLog(sessionTest ? '✅ sessionStorage working' : '❌ sessionStorage not working');
    } catch {
      addLog('❌ sessionStorage blocked or not available');
    }
  };

  return (
    <div className="min-h-screen bg-casino-dark p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-white">🔍 Auth Debug Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Auth Context Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-casino-dark/50 p-4 rounded-lg">
                <h3 className="text-casino-neon-green font-semibold mb-2">Auth Context</h3>
                <p className="text-white">Loading: {loading ? 'Yes' : 'No'}</p>
                <p className="text-white">User: {user ? user.email : 'None'}</p>
                <p className="text-white">User ID: {user ? user.id : 'None'}</p>
              </div>
              
              <div className="bg-casino-dark/50 p-4 rounded-lg">
                <h3 className="text-casino-neon-green font-semibold mb-2">Session Info</h3>
                <p className="text-white">Session: {sessionInfo ? 'Present' : 'None'}</p>
                <p className="text-white">Access Token: {sessionInfo?.access_token ? 'Present' : 'None'}</p>
                <p className="text-white">Expires: {sessionInfo?.expires_at ? new Date(sessionInfo.expires_at * 1000).toLocaleString() : 'N/A'}</p>
              </div>

              <div className="bg-casino-dark/50 p-4 rounded-lg">
                <h3 className="text-casino-neon-green font-semibold mb-2">Environment</h3>
                <p className="text-white">Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}</p>
                <p className="text-white">Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</p>
                <p className="text-white">Origin: {typeof window !== 'undefined' ? window.location.origin : 'Server'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTestSignIn} className="bg-casino-neon-green text-casino-dark">
                Test Google Sign In
              </Button>
              <Button onClick={handleTestSignOut} variant="outline" className="border-casino-border-subtle text-white">
                Test Sign Out
              </Button>
              <Button onClick={handleRefreshSession} variant="outline" className="border-casino-border-subtle text-white">
                Refresh Session
              </Button>
              <Button onClick={handleTestSupabaseConnection} variant="outline" className="border-casino-border-subtle text-white">
                Test Supabase Connection
              </Button>
              <Button onClick={handleTestCookies} variant="outline" className="border-casino-border-subtle text-white">
                Test Cookies
              </Button>
              <Button onClick={handleClearLogs} variant="outline" className="border-red-500 text-red-400">
                Clear Logs
              </Button>
            </div>

            {/* Auth Logs */}
            <div className="bg-casino-dark/50 p-4 rounded-lg">
              <h3 className="text-casino-neon-green font-semibold mb-2">Auth Logs (Last 20)</h3>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {authLogs.map((log, index) => (
                  <p key={index} className="text-sm text-gray-300 font-mono">{log}</p>
                ))}
              </div>
            </div>

            {/* Raw Session Data */}
            {sessionInfo && (
              <div className="bg-casino-dark/50 p-4 rounded-lg">
                <h3 className="text-casino-neon-green font-semibold mb-2">Raw Session Data</h3>
                <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                  {JSON.stringify(sessionInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
