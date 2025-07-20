'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/src/contexts/AuthContext'; // ✅ STABLE: Working perfectly
// import { AdminProvider } from '@/src/contexts/AdminContext'; // 🚨 TEMPORARILY DISABLED - Debugging infinite loop
import { TooltipProvider } from '@/src/components/ui/tooltip';
import { Toaster } from '@/src/components/ui/sonner';
import LiveChat from '@/src/components/LiveChat';

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
      <AuthProvider> {/* ✅ STABLE: Working perfectly */}
        {/* <AdminProvider> 🚨 TEMPORARILY DISABLED - Debugging infinite loop */}
          <TooltipProvider>
            {children}
            <Toaster position="top-right" />
            <LiveChat />
          </TooltipProvider>
        {/* </AdminProvider> 🚨 TEMPORARILY DISABLED - Debugging infinite loop */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
