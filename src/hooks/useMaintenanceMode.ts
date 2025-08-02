import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Convert pathname to API format
        const pathForApi = pathname === '/' ? 'home' : pathname.substring(1);
        
        const response = await fetch(`/api/maintenance/${encodeURIComponent(pathForApi)}`);
        
        if (!response.ok) {
          throw new Error('Failed to check maintenance status');
        }

        const data = await response.json();
        setMaintenanceStatus(data);
      } catch (err) {
        console.error('Error checking maintenance status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Default to not in maintenance if there's an error
        setMaintenanceStatus({
          is_maintenance: false,
          maintenance_message: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceStatus();
  }, [pathname]);

  return {
    isMaintenanceMode: maintenanceStatus.is_maintenance,
    maintenanceMessage: maintenanceStatus.maintenance_message,
    isLoading,
    error
  };
};
