'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { databaseApi } from '@/src/lib/database-api';
import type { CurrentUserAdminInfo } from '@/types/database';

interface AdminContextType {
  adminInfo: CurrentUserAdminInfo | null;
  isAdmin: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  checkPermissionAsync: (permission: string) => Promise<boolean>;
  refreshAdminInfo: () => Promise<void>;
  logActivity: (action: string, resourceType?: string, resourceId?: string, details?: Record<string, any>, severity?: 'info' | 'warning' | 'error' | 'critical') => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [adminInfo, setAdminInfo] = useState<CurrentUserAdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch admin info when user changes
  const fetchAdminInfo = async () => {
    if (!user) {
      setAdminInfo(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const info = await databaseApi.getCurrentUserAdminInfo();
      setAdminInfo(info);
    } catch (error) {
      console.error('Failed to fetch admin info:', error);
      setAdminInfo({ is_admin: false });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh admin info
  const refreshAdminInfo = async () => {
    await fetchAdminInfo();
  };

  // Check if user has specific permission (sync - for quick UI checks)
  const hasPermission = (permission: string): boolean => {
    if (!adminInfo?.is_admin) return false;
    if (adminInfo.role === 'super_admin') return true; // Super admin has all permissions

    // For specific permission checking, we'll use the database function
    // This is a simplified version - for real-time checking, use checkPermissionAsync
    return adminInfo.total_permissions > 0;
  };

  // Check permission with database call (async - for accurate checks)
  const checkPermissionAsync = async (permission: string): Promise<boolean> => {
    if (!adminInfo?.is_admin) return false;
    if (adminInfo.role === 'super_admin') return true;

    try {
      return await databaseApi.hasPermission(permission);
    } catch (error) {
      console.error('Failed to check permission:', error);
      return false;
    }
  };

  // Enhanced admin activity logging
  const logActivity = async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, any>,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ) => {
    if (!adminInfo?.is_admin) return;

    try {
      // Generate session ID if not exists
      if (!sessionStorage.getItem('admin_session_id')) {
        sessionStorage.setItem('admin_session_id', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      }
      const sessionId = sessionStorage.getItem('admin_session_id');

      await databaseApi.logAdminActivity(action, resourceType, resourceId, details, severity, sessionId);
    } catch (error) {
      console.error('Failed to log admin activity:', error);
    }
  };

  // Fetch admin info when user changes
  useEffect(() => {
    if (!authLoading) {
      fetchAdminInfo();
    }
  }, [user, authLoading]);

  const value: AdminContextType = {
    adminInfo,
    isAdmin: adminInfo?.is_admin || false,
    isLoading: isLoading || authLoading,
    hasPermission,
    checkPermissionAsync,
    refreshAdminInfo,
    logActivity,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

// Higher-order component for admin route protection
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string
) {
  return function AdminProtectedComponent(props: P) {
    const { isAdmin, isLoading, hasPermission } = useAdmin();
    const { user } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-casino-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
            <p className="text-gray-400">Checking admin access...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-casino-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
            <p className="text-gray-400 mb-6">Please sign in to access the admin dashboard.</p>
            <button 
              onClick={() => window.location.href = '/signin'}
              className="bg-casino-neon-green text-casino-dark px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-casino-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">You don't have admin privileges to access this page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-casino-neon-green text-casino-dark px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen bg-casino-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Insufficient Permissions</h1>
            <p className="text-gray-400 mb-6">You don't have the required permission: {requiredPermission}</p>
            <button 
              onClick={() => window.location.href = '/admin'}
              className="bg-casino-neon-green text-casino-dark px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook for checking specific permissions
export function usePermission(permission: string) {
  const { hasPermission } = useAdmin();
  return hasPermission(permission);
}

// Hook for admin activity logging
export function useAdminActivity() {
  const { logActivity } = useAdmin();
  return logActivity;
}
