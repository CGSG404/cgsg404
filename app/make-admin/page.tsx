'use client';

import { useState } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabaseClient';

export default function MakeAdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    setLoading(true);
    setResult('🔄 Processing...');

    try {
      // Step 1: Create/update user in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          role: 'super_admin',
          is_admin: true,
          created_at: new Date().toISOString()
        });

      if (userError) {
        setResult(`❌ Error updating users table: ${userError.message}`);
        setLoading(false);
        return;
      }

      // Step 2: Create admin_users record
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          user_id: user.id,
          role: 'super_admin',
          is_active: true,
          created_by: user.id,
          created_at: new Date().toISOString()
        });

      if (adminError) {
        setResult(`❌ Error creating admin record: ${adminError.message}`);
        setLoading(false);
        return;
      }

      setResult(`✅ Success! User ${user.email} is now admin. Please refresh the page.`);
      
      // Auto refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  const testAdminStatus = async () => {
    if (!user) {
      setResult('❌ No user logged in');
      return;
    }

    setLoading(true);
    setResult('🔍 Checking admin status...');

    try {
      // Check users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check admin_users table
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Test RPC function
      const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin');

      const status = {
        userRecord: userError ? `Error: ${userError.message}` : userRecord,
        adminRecord: adminError ? `Error: ${adminError.message}` : adminRecord,
        rpcIsAdmin: rpcError ? `Error: ${rpcError.message}` : rpcResult
      };

      setResult(`📊 Admin Status:\n${JSON.stringify(status, null, 2)}`);

    } catch (error) {
      setResult(`💥 Error checking status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-casino-dark p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">🔧 Make Admin Tool</h1>
        
        <div className="bg-casino-card-bg p-6 rounded-lg border border-casino-border-subtle space-y-6">
          {/* Current User Info */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Current User</h2>
            {user ? (
              <div className="text-gray-300">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-red-400">❌ No user logged in. Please sign in first.</p>
            )}
          </div>

          {/* Actions */}
          {user && (
            <div className="space-y-4">
              <button
                onClick={makeCurrentUserAdmin}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Processing...' : '🚨 Make Me Admin'}
              </button>

              <button
                onClick={testAdminStatus}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Checking...' : '🔍 Check Admin Status'}
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Result:</h3>
              <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-auto max-h-64">
                {result}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded">
            <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Instructions:</h3>
            <ol className="text-yellow-200 text-sm space-y-1">
              <li>1. Make sure you're logged in</li>
              <li>2. Click "Check Admin Status" to see current status</li>
              <li>3. Click "Make Me Admin" to grant admin privileges</li>
              <li>4. Refresh the page after success</li>
              <li>5. Admin button should appear in navbar</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
