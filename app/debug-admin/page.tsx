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
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        admin: {
          isAdmin: isAdminResult,
          adminInfo: adminInfoResult
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

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Access denied. Admin privileges required.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-casino-neon-green">🔧 Admin Debug Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={checkAdminStatus}
                disabled={loading}
                className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80"
              >
                {loading ? 'Checking...' : 'Refresh Admin Status'}
              </Button>

              {debugInfo && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-casino-neon-green">Debug Information:</h3>
                  <pre className="bg-casino-dark p-4 rounded text-sm overflow-auto text-casino-text">
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
