'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';
import { supabase } from '@/src/lib/supabaseClient';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import AdminFixWidget from '@/src/components/AdminFixWidget';

export default function DebugAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, adminInfo, isLoading } = useAdmin();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<string>('');

  console.log('🔍 DebugAdminPage: Auth state:', {
    user: user?.id,
    authLoading,
    adminLoading: isLoading,
    isAdmin
  });

  const checkAdminStatus = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Direct database calls
      const [isAdminResult, adminInfoResult] = await Promise.all([
        databaseApi.isCurrentUserAdmin(),
        databaseApi.getCurrentUserAdminInfo()
      ]);

      // Also check with direct RPC call
      const { data: directIsAdmin, error: directError } = await supabase.rpc('is_admin');

      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      setDebugInfo({
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        session: {
          exists: !!session,
          userId: session?.user?.id,
          error: sessionError?.message
        },
        admin: {
          isAdmin: isAdminResult,
          adminInfo: adminInfoResult,
          directIsAdmin,
          directError: directError?.message
        },
        context: {
          isAdmin,
          adminInfo,
          isLoading
        }
      });
    } catch (error) {
      console.error('Error checking admin status:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const setupAdmin = async () => {
    if (!user?.email) return;

    try {
      const result = await databaseApi.setupAdminUser(user.email, 'super_admin');
      setSetupResult(result);
      // Refresh admin status after setup
      setTimeout(() => {
        checkAdminStatus();
        window.location.reload(); // Force refresh to update context
      }, 1000);
    } catch (error) {
      setSetupResult(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for non-users
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Access denied. Please log in.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow access for debugging purposes - remove admin check

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Admin Fix Widget */}
        <AdminFixWidget />

        <Card>
          <CardHeader>
            <CardTitle className="text-casino-neon-green">🔧 Admin Debug Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={checkAdminStatus}
                  disabled={loading}
                  className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
                >
                  {loading ? 'Checking...' : 'Refresh Admin Status'}
                </Button>
                <Button
                  onClick={setupAdmin}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Setup as Super Admin
                </Button>
              </div>

              {setupResult && (
                <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
                  <h3 className="font-bold text-yellow-800">Setup Result:</h3>
                  <p className="text-yellow-700">{setupResult}</p>
                </div>
              )}

              {debugInfo && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-casino-neon-green">Debug Information:</h3>
                  <pre className="bg-casino-dark p-4 rounded text-sm overflow-auto text-casino-text max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-casino-neon-green">📊 Current State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-casino-neon-green">User Info:</h4>
                <p>ID: {user?.id}</p>
                <p>Email: {user?.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-casino-neon-green">Admin Status:</h4>
                <p>Is Admin: {isAdmin ? '✅ Yes' : '❌ No'}</p>
                <p>Loading: {isLoading ? '⏳ Yes' : '✅ No'}</p>
                {adminInfo && (
                  <>
                    <p>Role: {adminInfo.role}</p>
                    <p>Permissions: {adminInfo.total_permissions}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
