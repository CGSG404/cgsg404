'use client';

import React, { ReactNode } from 'react';
import { useMaintenanceMode } from '@/src/hooks/useMaintenanceMode';
import { useAdminCheck } from '@/src/hooks/useAdminCheck';
import MaintenancePage from './MaintenancePage';
import { useAuth } from '@/src/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
  allowAdminBypass?: boolean;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({
  children,
  allowAdminBypass = true
}) => {
  const { isMaintenanceMode, maintenanceMessage, isLoading, error, refreshStatus } = useMaintenanceMode();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();

  // Show loading state while checking maintenance status or admin status
  if (isLoading || (user && adminLoading)) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-casino-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">
            {isLoading ? 'Checking maintenance status...' : 'Verifying admin access...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-400 mb-4">
            <p className="text-lg font-semibold">Connection Error</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
          <button
            onClick={refreshStatus}
            className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If page is in maintenance mode
  if (isMaintenanceMode) {
    // Allow admin bypass if enabled and user is admin
    if (allowAdminBypass && isAdmin) {
      return (
        <div>
          {/* Admin Notice */}
          <div className="bg-orange-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
            ⚠️ ADMIN NOTICE: This page is in maintenance mode. Only admins can view this page.
            <button
              onClick={refreshStatus}
              className="ml-4 bg-orange-700 hover:bg-orange-800 px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
              title="Refresh maintenance status"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
          {children}
        </div>
      );
    }

    // Show maintenance page for non-admin users
    return <MaintenancePage message={maintenanceMessage} />;
  }

  // Normal page rendering
  return <>{children}</>;
};

export default MaintenanceWrapper;
