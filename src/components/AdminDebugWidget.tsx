'use client';

import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useAdmin } from '@/src/contexts/AdminContext';

export default function AdminDebugWidget() {
  const { user } = useAuth();
  const { isAdmin, adminInfo, isLoading } = useAdmin();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-xs z-50 border border-gray-600">
      <div className="font-bold text-yellow-400 mb-2">🔧 Admin Debug</div>
      <div className="space-y-1">
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Email: {user?.email || 'None'}</div>
        <div>Admin Loading: {isLoading ? '⏳' : '✅'}</div>
        <div>Is Admin: {isAdmin ? '✅ YES' : '❌ NO'}</div>
        <div>Admin Role: {adminInfo?.role || 'None'}</div>
        <div>Permissions: {adminInfo?.total_permissions || 0}</div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <a 
          href="/debug-admin" 
          className="text-blue-400 hover:underline text-xs"
        >
          → Full Debug Page
        </a>
      </div>
    </div>
  );
}
