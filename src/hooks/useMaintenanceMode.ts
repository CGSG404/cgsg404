import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface MaintenanceStatus {
  is_maintenance: boolean;
  maintenance_message: string | null;
}

// Initialize Supabase client for realtime subscriptions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useMaintenanceMode = () => {
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>({
    is_maintenance: false,
    maintenance_message: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const checkMaintenanceStatus = useCallback(async () => {
    try {
      setError(null);

      // Convert pathname to API format
      const pathForApi = pathname === '/' ? 'home' : pathname.substring(1);
      
      const response = await fetch(`/api/maintenance/${encodeURIComponent(pathForApi)}`, {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check maintenance status');
      }

      const data = await response.json();
      setMaintenanceStatus(data);
    } catch (err) {
      console.error('Error checking maintenance status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Default to not in maintenance if there's an error (fail-safe)
      setMaintenanceStatus({
        is_maintenance: false,
        maintenance_message: null
      });
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Initial check
    checkMaintenanceStatus();

    // Setup realtime subscription for maintenance changes
    const channel = supabase
      .channel(`maintenance_${pathname}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_maintenance',
          filter: `page_path=eq.${pathname}`
        },
        (payload) => {
          console.log('🔄 Maintenance status changed:', payload);
          // Refresh maintenance status when changes occur
          checkMaintenanceStatus();
        }
      )
      .subscribe();

    // Auto-refresh every 60 seconds as fallback
    const autoRefreshInterval = setInterval(() => {
      checkMaintenanceStatus();
    }, 60000);

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
      clearInterval(autoRefreshInterval);
    };
  }, [pathname, checkMaintenanceStatus]);

  // Manual refresh function
  const refreshStatus = useCallback(() => {
    setIsLoading(true);
    checkMaintenanceStatus();
  }, [checkMaintenanceStatus]);

  return {
    isMaintenanceMode: maintenanceStatus.is_maintenance,
    maintenanceMessage: maintenanceStatus.maintenance_message,
    isLoading,
    error,
    refreshStatus
  };
};
