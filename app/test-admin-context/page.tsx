'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';
import { supabase } from '@/src/lib/supabaseClient';
import { useState } from 'react';

export default function TestAdminContextPage() {
  const { user } = useAuth();
  const { isAdmin, adminInfo, isLoading } = useAdmin();
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      authContext: {
        user: user ? {
          id: user.id,
          email: user.email
        } : null
      },
      adminContext: {
        isAdmin,
        adminInfo,
        isLoading
      },
      directTests: {}
    };

    try {
      // Test 1: Direct RPC call
      console.log('🧪 Test 1: Direct RPC call...');
      const { data: rpcResult, error: rpcError } = await supabase.rpc('get_current_user_admin_info');
      results.directTests.rpcCall = rpcError ? { error: rpcError.message } : rpcResult;

      // Test 2: Database API call
      console.log('🧪 Test 2: Database API call...');
      const apiResult = await databaseApi.getCurrentUserAdminInfo();
      results.directTests.databaseApi = apiResult;

      // Test 3: Simple is_admin check
      console.log('🧪 Test 3: Simple is_admin check...');
      const { data: simpleCheck, error: simpleError } = await supabase.rpc('is_admin');
      results.directTests.simpleIsAdmin = simpleError ? { error: simpleError.message } : simpleCheck;

      // Test 4: Check session
      console.log('🧪 Test 4: Check session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      results.directTests.session = sessionError ? { error: sessionError.message } : {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      };

    } catch (error) {
      results.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setTestResults(results);
    setTesting(false);
  };

  const forceRefreshAdminContext = async () => {
    // This will trigger a re-fetch in AdminContext
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-casino-dark p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🧪 Admin Context Test Page</h1>
        
        <div className="space-y-6">
          {/* Current State */}
          <div className="bg-casino-card-bg p-6 rounded-lg border border-casino-border-subtle">
            <h2 className="text-xl font-semibold text-white mb-4">Current State</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Auth User:</span>
                <span className={`ml-2 ${user ? 'text-green-400' : 'text-red-400'}`}>
                  {user ? `✅ ${user.email}` : '❌ No user'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Admin Loading:</span>
                <span className={`ml-2 ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {isLoading ? '⏳ Loading' : '✅ Done'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Is Admin (Context):</span>
                <span className={`ml-2 ${isAdmin ? 'text-green-400' : 'text-red-400'}`}>
                  {isAdmin ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Admin Info:</span>
                <span className="ml-2 text-white">
                  {adminInfo ? `Role: ${adminInfo.role}` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-casino-card-bg p-6 rounded-lg border border-casino-border-subtle">
            <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
            <div className="space-x-4">
              <button
                onClick={runTests}
                disabled={testing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {testing ? '⏳ Running Tests...' : '🧪 Run All Tests'}
              </button>
              
              <button
                onClick={forceRefreshAdminContext}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                🔄 Force Refresh
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="bg-casino-card-bg p-6 rounded-lg border border-casino-border-subtle">
              <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
              <pre className="text-xs text-gray-300 bg-black p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Debug Info */}
          <div className="bg-casino-card-bg p-6 rounded-lg border border-casino-border-subtle">
            <h2 className="text-xl font-semibold text-white mb-4">Debug Info</h2>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Expected Flow:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>User logs in → AuthContext gets user</li>
                <li>AdminContext detects user change</li>
                <li>AdminContext calls databaseApi.getCurrentUserAdminInfo()</li>
                <li>Database API calls supabase.rpc('get_current_user_admin_info')</li>
                <li>RPC returns admin data</li>
                <li>AdminContext sets isAdmin = true</li>
                <li>Navbar shows Admin button</li>
              </ol>
              
              <p className="mt-4"><strong>Check Browser Console (F12) for detailed logs!</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
