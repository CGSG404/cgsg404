'use client';

import React from 'react';
import { useAdmin } from '@/src/contexts/AdminContext';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shield, ShieldCheck, ShieldX, Loader2 } from 'lucide-react';

/**
 * AdminStatusIndicator - Shows admin status in development mode
 * Helps with debugging admin access issues
 */
export default function AdminStatusIndicator() {
  const { isAdmin, adminInfo, isLoading, user } = useAdmin();
  const router = useRouter();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Don't show if no user
  if (!user) {
    return null;
  }

  const getStatusColor = () => {
    if (isLoading) return 'bg-yellow-500';
    if (isAdmin) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="w-3 h-3 animate-spin" />;
    if (isAdmin) return <ShieldCheck className="w-3 h-3" />;
    return <ShieldX className="w-3 h-3" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Loading...';
    if (isAdmin) return `Admin (${adminInfo?.role})`;
    return 'Not Admin';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 text-white text-xs">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-blue-400" />
        <span className="font-semibold">Admin Status</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span>{getStatusText()}</span>
          {getStatusIcon()}
        </div>
        
        <div className="text-gray-400">
          <div>User: {user.email}</div>
          {adminInfo && (
            <div>Permissions: {adminInfo.total_permissions}</div>
          )}
        </div>

        <div className="flex gap-1 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push('/debug-admin')}
            className="h-6 px-2 text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Debug
          </Button>
          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/admin')}
              className="h-6 px-2 text-xs border-green-600 text-green-400 hover:bg-green-900/20"
            >
              Admin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
