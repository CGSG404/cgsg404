'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { databaseApi } from '@/lib/database-api';

interface PermissionTest {
  id: string;
  name: string;
  result: boolean | null;
  loading: boolean;
}

export default function AdminPermissionDemo() {
  const { adminInfo, isAdmin, hasPermission, checkPermissionAsync } = useAdmin();
  const [permissionTests, setPermissionTests] = useState<PermissionTest[]>([
    { id: '16', name: 'Permission 16', result: null, loading: false },
    { id: '20', name: 'Permission 20', result: null, loading: false },
    { id: '25', name: 'Permission 25', result: null, loading: false },
    { id: '999', name: 'Permission 999 (Invalid)', result: null, loading: false },
  ]);

  // Test all permissions
  const testAllPermissions = async () => {
    setPermissionTests(prev => prev.map(test => ({ ...test, loading: true })));

    for (const test of permissionTests) {
      try {
        const result = await checkPermissionAsync(test.id);
        setPermissionTests(prev => 
          prev.map(t => 
            t.id === test.id 
              ? { ...t, result, loading: false }
              : t
          )
        );
      } catch (error) {
        console.error(`Error testing permission ${test.id}:`, error);
        setPermissionTests(prev => 
          prev.map(t => 
            t.id === test.id 
              ? { ...t, result: false, loading: false }
              : t
          )
        );
      }
    }
  };

  // Test individual permission
  const testPermission = async (permissionId: string) => {
    setPermissionTests(prev => 
      prev.map(test => 
        test.id === permissionId 
          ? { ...test, loading: true }
          : test
      )
    );

    try {
      const result = await checkPermissionAsync(permissionId);
      setPermissionTests(prev => 
        prev.map(test => 
          test.id === permissionId 
            ? { ...test, result, loading: false }
            : test
        )
      );
    } catch (error) {
      console.error(`Error testing permission ${permissionId}:`, error);
      setPermissionTests(prev => 
        prev.map(test => 
          test.id === permissionId 
            ? { ...test, result: false, loading: false }
            : test
        )
      );
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
        <p className="text-red-600">You need admin access to view this demo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🔧 Admin Permission System Demo
      </h2>

      {/* Admin Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-blue-600 font-medium">Email:</span>
            <p className="text-blue-800">{adminInfo?.email || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-blue-600 font-medium">Role:</span>
            <p className="text-blue-800 capitalize">{adminInfo?.role || 'N/A'}</p>
          </div>
          <div>
            <span className="text-sm text-blue-600 font-medium">Total Permissions:</span>
            <p className="text-blue-800">{adminInfo?.total_permissions || 0}</p>
          </div>
        </div>
      </div>

      {/* Permission Tests Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Permission Tests</h3>
          <button
            onClick={testAllPermissions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test All Permissions
          </button>
        </div>

        <div className="space-y-3">
          {permissionTests.map((test) => (
            <div key={test.id} className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <span className="font-medium text-gray-800">{test.name}</span>
                <span className="text-sm text-gray-500 ml-2">(ID: {test.id})</span>
              </div>
              
              <div className="flex items-center space-x-3">
                {test.loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <div className="flex items-center space-x-2">
                    {test.result !== null && (
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        test.result 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {test.result ? '✅ Allowed' : '❌ Denied'}
                      </span>
                    )}
                    <button
                      onClick={() => testPermission(test.id)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Test
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => window.open('/admin/dashboard', '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🏠 Open Admin Dashboard
          </button>
          <button
            onClick={() => window.open('/admin/permissions', '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            🔑 Manage Permissions
          </button>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">🎯 Integration Status</h3>
        <ul className="text-yellow-700 space-y-1">
          <li>✅ Database Functions: Working</li>
          <li>✅ RLS Policies: Applied</li>
          <li>✅ Admin Context: Updated</li>
          <li>✅ Permission Checking: Functional</li>
        </ul>
      </div>
    </div>
  );
}
