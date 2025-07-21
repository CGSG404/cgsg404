'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AdminFixWidget from '@/src/components/AdminFixWidget';

export default function FixAdminPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const userEmail = searchParams.get('user_email');
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔧 Admin Access Fix Tool</h1>
          <p className="text-gray-300 text-lg">
            Diagnose and fix admin access issues for CGSG404
          </p>
        </div>
        
        <AdminFixWidget />
        
        <div className="mt-8 text-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">
              {error === 'admin_access_denied' ? '🚨 Admin Access Denied' : '🚨 Admin Access Issue?'}
            </h2>
            <div className="text-left space-y-2">
              {error === 'admin_access_denied' && userEmail && (
                <div className="bg-red-900 p-4 rounded mb-4">
                  <p><strong>User:</strong> {userEmail}</p>
                  <p><strong>Issue:</strong> Account not registered as admin</p>
                </div>
              )}
              <p><strong>Problem:</strong> You're logged in but can't access admin dashboard</p>
              <p><strong>Cause:</strong> Your account is not registered as admin in the database</p>
              <p><strong>Solution:</strong> Click "Fix Admin Access" above to register yourself as super admin</p>
              <div className="mt-4 p-3 bg-blue-900 rounded">
                <p className="text-sm"><strong>Note:</strong> This tool is only available in development mode for security reasons.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
