'use client';

import { type ReactNode, useEffect } from 'react';
import Providers from './providers';
import { AppSidebar } from '@/src/components/ui/sidebar';
import BackToTop from '@/src/components/BackToTop';
import { setupGlobalErrorHandler } from '@/src/lib/errorHandler';

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Setup global error handlers
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar kiri, fixed di desktop, drawer di mobile */}
      <div className="hidden md:block w-64 flex-shrink-0 h-full">
        <AppSidebar />
      </div>
      {/* Konten utama */}
      <div className="flex-1 min-w-0">
        <Providers>{children}</Providers>
        <BackToTop />
      </div>
    </div>
  );
}