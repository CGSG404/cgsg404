'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/src/contexts/AuthContext'; // ✅ STABLE: Working perfectly
import { AdminProvider } from '@/src/contexts/AdminContext'; // ✅ RE-ENABLED: Fixed double providers issue
import { LoadingProvider } from '@/src/contexts/LoadingContext'; // 🚀 NEW: Loading state management
import { TooltipProvider } from '@/src/components/ui/tooltip';
import { Toaster } from '@/src/components/ui/sonner';
import FloatingWidgetManager from '@/src/components/FloatingWidgetManager'; // 🚀 NEW: Unified widget manager
import NavigationLoader from '@/src/components/NavigationLoader'; // 🚀 NEW: App Router navigation loading
import LoadingTest from '@/src/components/LoadingTest'; // 🧪 TEST: Loading system test (dev only)

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
      <LoadingProvider> {/* 🚀 NEW: Loading state management */}
        <AuthProvider> {/* ✅ STABLE: Working perfectly */}
          <AdminProvider> {/* ✅ RE-ENABLED: Fixed double providers issue */}
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
              <FloatingWidgetManager /> {/* 🚀 NEW: Unified widget manager */}
              <NavigationLoader /> {/* 🚀 NEW: App Router navigation loading */}
              <LoadingTest /> {/* 🧪 TEST: Loading system test (dev only) */}
            </TooltipProvider>
          </AdminProvider>
        </AuthProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}
