'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { supabase } from '@/src/lib/supabaseClient';

export default function SessionDebugWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const { user: authUser, loading: authLoading } = useAuth();
  const { user: adminUser, isAdmin, isLoading: adminLoading, adminInfo } = useAdmin();

  const refreshSessionInfo = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSessionInfo({
        session: session ? {
          user: {
            id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at
          },
          expires_at: session.expires_at,
          access_token: session.access_token ? 'present' : 'missing',
          refresh_token: session.refresh_token ? 'present' : 'missing'
        } : null,
        error: error?.message,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setSessionInfo({
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      refreshSessionInfo();
    }
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        size="sm"
        className="mb-2 bg-blue-600 hover:bg-blue-700"
      >
        🔍 Session Debug
      </Button>
      
      {isVisible && (
        <Card className="w-96 max-h-96 overflow-y-auto bg-gray-900 text-white border-gray-700">
          <CardContent className="p-4 text-xs">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">Session Debug</h3>
                <Button
                  onClick={refreshSessionInfo}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  Refresh
                </Button>
              </div>

              {/* Auth Context */}
              <div className="border border-gray-700 p-2 rounded">
                <h4 className="font-semibold text-yellow-400">AuthContext</h4>
                <div>User: {authUser ? `${authUser.email} (${authUser.id})` : 'null'}</div>
                <div>Loading: {authLoading ? 'true' : 'false'}</div>
              </div>

              {/* Admin Context */}
              <div className="border border-gray-700 p-2 rounded">
                <h4 className="font-semibold text-purple-400">AdminContext</h4>
                <div>User: {adminUser ? `${adminUser.email} (${adminUser.id})` : 'null'}</div>
                <div>Is Admin: {isAdmin ? 'true' : 'false'}</div>
                <div>Loading: {adminLoading ? 'true' : 'false'}</div>
                <div>Admin Info: {adminInfo ? JSON.stringify(adminInfo, null, 2) : 'null'}</div>
              </div>

              {/* Supabase Session */}
              <div className="border border-gray-700 p-2 rounded">
                <h4 className="font-semibold text-green-400">Supabase Session</h4>
                {sessionInfo ? (
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(sessionInfo, null, 2)}
                  </pre>
                ) : (
                  <div>Click refresh to load session info</div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border border-gray-700 p-2 rounded">
                <h4 className="font-semibold text-red-400">Quick Actions</h4>
                <div className="space-y-1">
                  <Button
                    onClick={() => window.location.href = '/admin'}
                    size="sm"
                    className="w-full text-xs"
                  >
                    Go to Admin
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/signin'}
                    size="sm"
                    className="w-full text-xs"
                  >
                    Go to Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    size="sm"
                    variant="destructive"
                    className="w-full text-xs"
                  >
                    Clear & Reload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
