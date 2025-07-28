'use client';

import { type ReactNode, useEffect } from 'react';
// Temporarily disable complex imports to fix ChunkLoadError
// import { AppSidebar } from '@/src/components/ui/sidebar';
// import { setupGlobalErrorHandler } from '@/src/lib/errorHandler';

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Temporarily disable complex setup to fix ChunkLoadError
  useEffect(() => {
    console.log('🔧 ClientLayout: Simplified for debugging');
    // Temporarily disable CSS import that might cause issues
    // import('@/src/styles/sidebar-mobile.css');
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Temporarily disable sidebar to fix ChunkLoadError */}
      {/* <div className="hidden md:block w-72 flex-shrink-0 h-full">
        <AppSidebar />
      </div> */}
      {/* Konten utama - full width for now */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}