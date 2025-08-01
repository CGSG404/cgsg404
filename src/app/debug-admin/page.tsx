'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/src/lib/database-api';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function DebugAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, adminInfo, isLoading } = useAdmin();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
      const [isAdminResult, adminInfoResult] = await Promise.all([
        databaseApi.isCurrentUserAdmin(),
        databaseApi.getCurrentUserAdminInfo()
      ]);

      setDebugInfo({
        user_id: user.id,
        email: user.email,
        isAdmin: isAdminResult,
        adminInfo: adminInfoResult,
        contextIsAdmin: isAdmin,
        contextAdminInfo: adminInfo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <Card className="w-full max-w-md bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-casino-neon-green">🔐 Admin Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-400">⏳ Loading authentication...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <Card className="w-full max-w-md bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-casino-neon-green">🔐 Admin Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-400">Please sign in to check admin status</p>

              <div className="bg-casino-dark p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📋 Steps to become admin:</h4>
                <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                  <li>Sign in with Google</li>
                  <li>Copy your User ID from this debug page</li>
                  <li>Ask developer to add you to admin_users table</li>
                  <li>Or run SQL command in Supabase</li>
                </ol>
              </div>

              <Button
                onClick={() => window.location.href = '/signin'}
                className="w-full bg-casino-neon-green text-casino-dark"
              >
                🚀 Sign In with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-casino-card-bg border-casino-border-subtle">
          <CardHeader>
            <CardTitle className="text-casino-neon-green">🔐 Admin Status Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">👤 User Information</h3>
              <div className="bg-casino-dark p-4 rounded-lg">
                <p className="text-gray-300"><strong>ID:</strong> {user.id}</p>
                <p className="text-gray-300"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-300"><strong>Created:</strong> {user.created_at}</p>
              </div>
            </div>

            {/* Admin Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🛡️ Admin Status</h3>
              <div className="bg-casino-dark p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Context isAdmin:</strong> 
                  <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>
                    {isAdmin ? ' ✅ YES' : ' ❌ NO'}
                  </span>
                </p>
                <p className="text-gray-300">
                  <strong>Context Loading:</strong> 
                  <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
                    {isLoading ? ' ⏳ Loading...' : ' ✅ Loaded'}
                  </span>
                </p>
              </div>
            </div>

            {/* Debug Results */}
            {debugInfo && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🔍 Debug Results</h3>
                <div className="bg-casino-dark p-4 rounded-lg">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={checkAdminStatus} 
                disabled={loading}
                className="bg-casino-neon-green text-casino-dark"
              >
                {loading ? '⏳ Checking...' : '🔄 Refresh Status'}
              </Button>
              
              {isAdmin && (
                <Button 
                  onClick={() => window.location.href = '/admin'}
                  className="bg-casino-neon-purple text-white"
                >
                  🚀 Go to Admin Dashboard
                </Button>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">📋 Instructions</h3>
              <div className="bg-casino-dark p-4 rounded-lg text-gray-300 text-sm">
                <p className="mb-2"><strong>If you're NOT an admin:</strong></p>
                <ol className="list-decimal list-inside space-y-1 mb-4">
                  <li>Copy your User ID from above</li>
                  <li>Ask the developer to add you as admin in Supabase</li>
                  <li>Or run the SQL command to add yourself</li>
                </ol>
                
                <p className="mb-2"><strong>SQL Command to add admin:</strong></p>
                <code className="block bg-black p-2 rounded text-green-400 text-xs">
                  INSERT INTO admin_users (user_id, email, role) <br/>
                  VALUES ('{user.id}', '{user.email}', 'super_admin');
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
