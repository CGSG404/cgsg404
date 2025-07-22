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

    // Import mobile sidebar CSS for panel consistency
    import('@/src/styles/sidebar-mobile.css');
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar kiri, fixed di desktop, drawer di mobile - RESPONSIVE WIDTH */}
      <div className="hidden md:block w-44 xs:w-48 sm:w-52 md:w-56 lg:w-[14rem] flex-shrink-0 h-full">
        <AppSidebar />
      </div>
      {/* Konten utama */}
      <div className="flex-1 min-w-0">
        {children} {/* 🚨 REMOVED DOUBLE PROVIDERS - Already wrapped in layout.tsx */}
      </div>
    </div>
  );
}