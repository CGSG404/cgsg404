import { useState, useEffect } from 'react';
import { casinosApi } from '@/lib/api-client';

interface Casino {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  bonus_info?: string;
  rating?: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface UseCasinosReturn {
  casinos: Casino[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCasinos(): UseCasinosReturn {
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCasinos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await casinosApi.getAll();
      setCasinos(response.casinos || []);
    } catch (err) {
      console.error('Error fetching casinos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch casinos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasinos();
  }, []);

  return {
    casinos,
    loading,
    error,
    refetch: fetchCasinos,
  };
}

// Hook for single casino
export function useCasino(id: string) {
  const [casino, setCasino] = useState<Casino | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCasino = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await casinosApi.getById(id);
        setCasino(response.casino);
      } catch (err) {
        console.error('Error fetching casino:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch casino');
      } finally {
        setLoading(false);
      }
    };

    fetchCasino();
  }, [id]);

  return {
    casino,
    loading,
    error,
  };
}
