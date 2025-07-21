'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DebugSession() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Get storage info
        const storage: any = {};
        
        // Check localStorage
        const localKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('auth') || key.includes('session') || key.includes('token') || 
                     key.includes('supabase') || key.startsWith('sb-'))) {
            localKeys.push({
              key,
              value: localStorage.getItem(key)?.substring(0, 100) + '...'
            });
          }
        }
        
        // Check sessionStorage
        const sessionKeys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('auth') || key.includes('session') || key.includes('token') || 
                     key.includes('supabase') || key.startsWith('sb-'))) {
            sessionKeys.push({
              key,
              value: sessionStorage.getItem(key)?.substring(0, 100) + '...'
            });
          }
        }
        
        storage.localStorage = localKeys;
        storage.sessionStorage = sessionKeys;
        
        setSessionInfo({
          session,
          error,
          hasSession: !!session,
          user: session?.user,
          expires: session?.expires_at
        });
        
        setStorageInfo(storage);
        
      } catch (err) {
        console.error('Debug session error:', err);
        setSessionInfo({ error: err });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleClearStorage = () => {
    // Clear all auth storage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('session') || key.includes('token') || 
                 key.includes('supabase') || key.startsWith('sb-'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('auth') || key.includes('session') || key.includes('token') || 
                 key.includes('supabase') || key.startsWith('sb-'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    window.location.reload();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-dark text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Session Debug</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug</h1>
        
        <div className="grid gap-6">
          {/* Session Info */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>

          {/* Storage Info */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Storage Information</h2>
            <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(storageInfo, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={handleClearStorage}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Clear Auth Storage
              </button>
              <button
                onClick={handleSignOut}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
              >
                Sign Out
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Refresh
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
