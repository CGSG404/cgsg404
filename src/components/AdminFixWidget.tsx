'use client';

import React, { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { databaseApi } from '@/src/lib/database-api';
import { supabase } from '@/src/lib/supabaseClient';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

interface DiagnosisResult {
  session: {
    exists: boolean;
    userId?: string;
    email?: string;
    error?: string;
  };
  adminRecord: {
    exists: boolean;
    data?: any;
    error?: string;
  };
  rpcTest: {
    isAdmin: boolean;
    error?: string;
  };
  adminInfo: {
    data?: any;
    error?: string;
  };
}

export default function AdminFixWidget() {
  const { user } = useAuth();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupResult, setSetupResult] = useState<string>('');

  // Auto-run diagnosis on mount
  React.useEffect(() => {
    if (user) {
      runDiagnosis();
    }
  }, [user]);

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      // 1. Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // 2. Check admin record
      let adminRecord = { exists: false, data: null, error: null };
      if (session?.user?.id) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id);
        
        adminRecord = {
          exists: adminData && adminData.length > 0,
          data: adminData,
          error: adminError?.message
        };
      }

      // 3. Test RPC function
      const { data: isAdminResult, error: rpcError } = await supabase.rpc('is_admin');

      // 4. Test admin info function
      const { data: adminInfoData, error: adminInfoError } = await supabase.rpc('get_current_user_admin_info');

      setDiagnosis({
        session: {
          exists: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          error: sessionError?.message
        },
        adminRecord,
        rpcTest: {
          isAdmin: isAdminResult === true,
          error: rpcError?.message
        },
        adminInfo: {
          data: adminInfoData,
          error: adminInfoError?.message
        }
      });

    } catch (error) {
      console.error('Diagnosis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fixAdminAccess = async () => {
    if (!user?.email) {
      setSetupResult('Error: No user email found');
      return;
    }

    try {
      setSetupResult('Setting up admin access...');
      
      // Use the setup_admin_user RPC function
      const { data: result, error } = await supabase.rpc('setup_admin_user', {
        admin_email: user.email,
        admin_role: 'super_admin'
      });

      if (error) {
        setSetupResult(`Error: ${error.message}`);
        return;
      }

      setSetupResult(`Success: ${result}`);
      
      // Re-run diagnosis after setup
      setTimeout(() => {
        runDiagnosis();
        // Force page reload to refresh context
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 1000);

    } catch (error) {
      setSetupResult(`Error: ${error.message}`);
    }
  };

  const getStatusIcon = (condition: boolean) => {
    return condition ? '✅' : '❌';
  };

  const getStatusColor = (condition: boolean) => {
    return condition ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">🔧 Admin Access Fix Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-gray-800">Current User</h3>
          <p className="text-gray-700"><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
          <p className="text-gray-700"><strong>ID:</strong> {user?.id || 'None'}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            onClick={runDiagnosis}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Running...' : 'Run Diagnosis'}
          </Button>
          <Button 
            onClick={fixAdminAccess}
            disabled={!user}
            className="bg-red-600 hover:bg-red-700"
          >
            Fix Admin Access
          </Button>
        </div>

        {/* Setup Result */}
        {setupResult && (
          <div className={`p-4 rounded-lg ${setupResult.includes('Error') ? 'bg-red-100 border border-red-400' : 'bg-green-100 border border-green-400'}`}>
            <h3 className="font-bold">Setup Result:</h3>
            <p>{setupResult}</p>
          </div>
        )}

        {/* Diagnosis Results */}
        {diagnosis && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Diagnosis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Session Check */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-bold mb-2 text-gray-800">
                  {getStatusIcon(diagnosis.session.exists)} Session
                </h4>
                <p className={`font-medium ${getStatusColor(diagnosis.session.exists)}`}>
                  {diagnosis.session.exists ? 'Active' : 'No session'}
                </p>
                {diagnosis.session.error && (
                  <p className="text-red-600 text-sm">Error: {diagnosis.session.error}</p>
                )}
              </div>

              {/* Admin Record Check */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-bold mb-2 text-gray-800">
                  {getStatusIcon(diagnosis.adminRecord.exists)} Admin Record
                </h4>
                <p className={`font-medium ${getStatusColor(diagnosis.adminRecord.exists)}`}>
                  {diagnosis.adminRecord.exists ? 'Found' : 'Not found'}
                </p>
                {diagnosis.adminRecord.error && (
                  <p className="text-red-600 text-sm">Error: {diagnosis.adminRecord.error}</p>
                )}
              </div>

              {/* RPC Function Check */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-bold mb-2 text-gray-800">
                  {getStatusIcon(diagnosis.rpcTest.isAdmin)} is_admin() Function
                </h4>
                <p className={`font-medium ${getStatusColor(diagnosis.rpcTest.isAdmin)}`}>
                  {diagnosis.rpcTest.isAdmin ? 'Working' : 'Failed'}
                </p>
                {diagnosis.rpcTest.error && (
                  <p className="text-red-600 text-sm">Error: {diagnosis.rpcTest.error}</p>
                )}
              </div>

              {/* Admin Info Check */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-bold mb-2 text-gray-800">
                  {getStatusIcon(!!diagnosis.adminInfo.data)} Admin Info Function
                </h4>
                <p className={`font-medium ${getStatusColor(!!diagnosis.adminInfo.data)}`}>
                  {diagnosis.adminInfo.data ? 'Working' : 'Failed'}
                </p>
                {diagnosis.adminInfo.error && (
                  <p className="text-red-600 text-sm">Error: {diagnosis.adminInfo.error}</p>
                )}
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-gray-100 p-4 rounded-lg border">
              <h4 className="font-bold mb-2 text-gray-800">Detailed Results</h4>
              <pre className="text-sm text-gray-700 overflow-auto max-h-64 bg-white p-3 rounded border">
                {JSON.stringify(diagnosis, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
