import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

interface MaintenanceStatus {
  is_maintenance: boolean;
  maintenance_message: string | null;
}

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

      // Handle null pathname
      if (!pathname) {
        setMaintenanceStatus({
          is_maintenance: false,
          maintenance_message: null
        });
        return;
      }

      // Convert pathname to API format
      const pathForApi = pathname === '/' ? 'home' : pathname.substring(1);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`/api/maintenance/${encodeURIComponent(pathForApi)}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to check maintenance status`);
      }

      const data = await response.json();
      setMaintenanceStatus(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('⚠️ Maintenance check timeout - defaulting to not in maintenance');
        setError('Connection timeout');
      } else {
        console.error('❌ Error checking maintenance status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
      
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
    // Convert pathname to match database format (remove leading slash)
    const pathForSubscription = pathname === '/' ? 'home' : pathname.substring(1);
    
    const channel = supabase
      .channel(`maintenance_${pathForSubscription}_${Date.now()}`) // Unique channel name
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_maintenance',
          filter: `page_path=eq.${pathForSubscription}`
        },
        (payload) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Maintenance status changed:', payload);
          }
          // Refresh maintenance status when changes occur
          checkMaintenanceStatus();
        }
      )
      .subscribe();

    // Auto-refresh every 2 minutes as fallback
    const autoRefreshInterval = setInterval(() => {
      checkMaintenanceStatus();
    }, 120000); // 2 minutes

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
