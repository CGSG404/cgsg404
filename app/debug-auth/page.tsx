'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { useAuth } from '@/src/contexts/AuthContext';

export default function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});
  const { user, loading, error } = useAuth();

  useEffect(() => {
    const collectDebugInfo = async () => {
      const info = {
        // Environment
        nodeEnv: process.env.NODE_ENV,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        
        // Current state
        currentUrl: window.location.href,
        origin: window.location.origin,
        
        // Auth state
        hasUser: !!user,
        userEmail: user?.email,
        authLoading: loading,
        authError: error,
        
        // Storage
        localStorage: {},
        sessionStorage: {},
        
        // Expected URLs
        expectedCallback: `${window.location.origin}/auth/callback`,
        expectedSignin: `${window.location.origin}/signin`,
      };

      // Check storage
      try {
        const authKeys = ['sb-auth-token', 'sb-plhpubcmugqosexcgdhj-auth-token'];
        authKeys.forEach(key => {
          try {
            (info.localStorage as any)[key] = localStorage.getItem(key) ? 'Present' : 'Not found';
            (info.sessionStorage as any)[key] = sessionStorage.getItem(key) ? 'Present' : 'Not found';
          } catch (e) {
            (info.localStorage as any)[key] = 'Error accessing';
            (info.sessionStorage as any)[key] = 'Error accessing';
          }
        });
      } catch (e) {
        (info as any).storageError = (e as any).message;
      }

      setDebugInfo(info);
    };

    collectDebugInfo();
  }, [user, loading, error]);

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      setTestResults((prev: any) => ({
        ...prev,
        supabaseConnection: error ? `Error: ${error.message}` : 'Success'
      }));
    } catch (e) {
      setTestResults((prev: any) => ({
        ...prev,
        supabaseConnection: `Exception: ${(e as any).message}`
      }));
    }
  };

  const testAuthSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      setTestResults(prev => ({
        ...prev,
        authSession: error ? `Error: ${error.message}` : session ? 'Session found' : 'No session'
      }));
    } catch (e) {
      setTestResults(prev => ({
        ...prev,
        authSession: `Exception: ${e.message}`
      }));
    }
  };

  const clearAllStorage = () => {
    const keysToRemove = [
      'sb-auth-token',
      'sb-plhpubcmugqosexcgdhj-auth-token',
      'supabase.auth.token'
    ];

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn(`Failed to clear ${key}:`, e);
      }
    });

    setTestResults(prev => ({
      ...prev,
      clearStorage: 'Completed'
    }));
  };

  return (
    <div className="min-h-screen bg-casino-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-casino-neon-green mb-8">🔧 Authentication Debug Center</h1>
        
        {/* Current Status */}
        <div className="bg-casino-card-bg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-casino-neon-green">📊 Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Auth State:</strong> {loading ? 'Loading...' : user ? '✅ Logged In' : '❌ Not Logged In'}
            </div>
            <div>
              <strong>User:</strong> {user?.email || 'None'}
            </div>
            <div>
              <strong>Error:</strong> {error || 'None'}
            </div>
            <div>
              <strong>Environment:</strong> {debugInfo.nodeEnv}
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-casino-card-bg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-casino-neon-green">🌐 Environment Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div><strong>NODE_ENV:</strong> {debugInfo.nodeEnv}</div>
            <div><strong>SITE_URL:</strong> {debugInfo.siteUrl}</div>
            <div><strong>SUPABASE_URL:</strong> {debugInfo.supabaseUrl}</div>
            <div><strong>Current URL:</strong> {debugInfo.currentUrl}</div>
            <div><strong>Origin:</strong> {debugInfo.origin}</div>
            <div><strong>Expected Callback:</strong> {debugInfo.expectedCallback}</div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-casino-card-bg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-casino-neon-green">💾 Storage Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">LocalStorage:</h3>
              {Object.entries(debugInfo.localStorage || {}).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <strong>{key}:</strong> {value as string}
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-2">SessionStorage:</h3>
              {Object.entries(debugInfo.sessionStorage || {}).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <strong>{key}:</strong> {value as string}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-casino-card-bg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-casino-neon-green">🧪 Test Actions</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={testSupabaseConnection}
                className="bg-casino-neon-green text-casino-dark px-4 py-2 rounded font-semibold hover:bg-casino-neon-green/80"
              >
                Test Supabase Connection
              </button>
              <button
                onClick={testAuthSession}
                className="bg-casino-neon-green text-casino-dark px-4 py-2 rounded font-semibold hover:bg-casino-neon-green/80"
              >
                Test Auth Session
              </button>
              <button
                onClick={clearAllStorage}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
              >
                Clear All Storage
              </button>
            </div>
            
            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="mt-4 p-4 bg-casino-dark rounded">
                <h3 className="font-semibold mb-2">Test Results:</h3>
                {Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="text-sm">
                    <strong>{test}:</strong> {result as string}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Configuration Guide */}
        <div className="bg-casino-card-bg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-casino-neon-green">📋 Configuration Checklist</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded">
              <h3 className="font-semibold text-yellow-400 mb-2">🔧 Supabase Dashboard Settings</h3>
              <p className="text-sm mb-2">Go to: Authentication → URL Configuration</p>
              <ul className="text-sm space-y-1">
                <li>• Site URL: <code className="bg-casino-dark px-1 rounded">http://localhost:3000</code></li>
                <li>• Redirect URLs: <code className="bg-casino-dark px-1 rounded">http://localhost:3000/auth/callback</code></li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-600 rounded">
              <h3 className="font-semibold text-blue-400 mb-2">🔑 Google Cloud Console</h3>
              <p className="text-sm mb-2">OAuth 2.0 Client → Authorized redirect URIs:</p>
              <ul className="text-sm">
                <li>• <code className="bg-casino-dark px-1 rounded">https://plhpubcmugqosexcgdhj.supabase.co/auth/v1/callback</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <a
            href="/signin"
            className="inline-block bg-casino-neon-green text-casino-dark px-6 py-3 rounded-lg font-semibold hover:bg-casino-neon-green/80 mr-4"
          >
            Test Sign In
          </a>
          <a
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
