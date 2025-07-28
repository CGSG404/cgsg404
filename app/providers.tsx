'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import providers with correct paths
import { AuthProvider } from '../src/contexts/AuthContext';
import { AdminProvider } from '../src/contexts/AdminContext';
import { LoadingProvider } from '../src/contexts/LoadingContext';
import { TooltipProvider } from '../src/components/ui/tooltip';
import { Toaster } from '../src/components/ui/sonner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data dianggap stale setelah 1 menit
      refetchOnWindowFocus: false, // Nonaktifkan refetch otomatis saat focus window
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AuthProvider>
          <AdminProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </AdminProvider>
        </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
