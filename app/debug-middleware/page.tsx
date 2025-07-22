'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/src/contexts/AuthContext';

export default function DebugMiddlewarePage() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const runDebug = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🔍 Starting middleware debug...');

      // 1. Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('📋 Session check:', { session: !!session, error: sessionError });

      // 2. Test is_admin RPC directly
      const { data: isAdminResult, error: rpcError } = await supabase.rpc('is_admin');
      console.log('🔧 is_admin RPC:', { result: isAdminResult, error: rpcError });

      // 3. Check admin_users table directly
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      console.log('👤 Admin record:', { record: adminRecord, error: adminError });

      // 4. Test middleware simulation
      let middlewareSimulation = null;
      try {
        // Simulate what middleware does
        if (session) {
          const { data: middlewareIsAdmin, error: middlewareError } = await supabase.rpc('is_admin');
          middlewareSimulation = {
            hasSession: true,
            isAdmin: middlewareIsAdmin,
            error: middlewareError?.message
          };
        } else {
          middlewareSimulation = {
            hasSession: false,
            wouldRedirect: true
          };
        }
      } catch (error: any) {
        middlewareSimulation = {
          error: error.message
        };
      }

      setDebugInfo({
        user: {
          id: user.id,
          email: user.email
        },
        session: {
          exists: !!session,
          userId: session?.user?.id,
          error: sessionError?.message
        },
        rpcTest: {
          isAdmin: isAdminResult,
          error: rpcError?.message
        },
        adminRecord: {
          exists: !!adminRecord,
          data: adminRecord,
          error: adminError?.message
        },
        middlewareSimulation,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Debug failed:', error);
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDebug();
    }
  }, [user]);

  const testAdminRoute = () => {
    console.log('🚀 Testing admin route...');
    window.location.href = '/admin';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to debug middleware.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Middleware Debug</h1>
        
        <div className="grid gap-6">
          {/* Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>
            <div className="flex gap-4">
              <button
                onClick={runDebug}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Running...' : 'Run Debug'}
              </button>
              <button
                onClick={testAdminRoute}
                className="bg-casino-neon-green text-casino-dark px-4 py-2 rounded hover:opacity-90"
              >
                Test Admin Route
              </button>
            </div>
          </div>

          {/* Debug Results */}
          {debugInfo && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Debug Results</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          {/* Expected Behavior */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Expected Behavior</h2>
            <div className="text-gray-300 space-y-2">
              <p><strong>✅ If you're admin:</strong> Should access /admin without redirect</p>
              <p><strong>❌ If session missing:</strong> Redirect to /signin?redirectTo=/admin</p>
              <p><strong>❌ If not admin:</strong> Redirect to / with error</p>
              <p><strong>🔧 If RPC error:</strong> Redirect to /session-fix (production) or /signin (dev)</p>
            </div>
          </div>

          {/* Current Issue */}
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">🚨 Current Issue</h2>
            <div className="text-red-300 space-y-2">
              <p>You're being redirected to signin even though you're logged in as admin.</p>
              <p>This suggests either:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Session is not being detected in middleware</li>
                <li>is_admin() RPC is failing in middleware context</li>
                <li>There's a timing issue with session validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
