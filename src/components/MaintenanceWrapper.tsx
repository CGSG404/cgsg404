'use client';

import React from 'react';
import { useMaintenanceMode } from '@/src/hooks/useMaintenanceMode';
import MaintenancePage from './MaintenancePage';
import { useAuth } from '@/src/contexts/AuthContext';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
  allowAdminBypass?: boolean;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ 
  children, 
  allowAdminBypass = true 
}) => {
  const { isMaintenanceMode, maintenanceMessage, isLoading } = useMaintenanceMode();
  const { user, isAdmin } = useAuth();

  // Show loading state while checking maintenance status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-casino-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-casino-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
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
          <div className="bg-orange-600 text-white px-4 py-2 text-center text-sm font-medium">
            ⚠️ ADMIN NOTICE: This page is in maintenance mode. Only admins can view this page.
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
