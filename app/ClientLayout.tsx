'use client';

import { type ReactNode, useEffect } from 'react';
// import Providers from './providers'; // 🚨 REMOVED - Already imported in layout.tsx
import { AppSidebar } from '@/src/components/ui/sidebar';
import { setupGlobalErrorHandler } from '@/src/lib/errorHandler';

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Setup global error handlers - TEMPORARILY DISABLED
  useEffect(() => {
    // setupGlobalErrorHandler(); // Disabled to prevent infinite loops
    console.log('🔧 Global error handler disabled for debugging');
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar kiri, fixed di desktop, drawer di mobile */}
      <div className="hidden md:block w-64 flex-shrink-0 h-full">
        <AppSidebar />
      </div>
      {/* Konten utama */}
      <div className="flex-1 min-w-0">
        {children} {/* 🚨 REMOVED DOUBLE PROVIDERS - Already wrapped in layout.tsx */}
      </div>
    </div>
  );
}