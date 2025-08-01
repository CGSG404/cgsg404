'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setupGlobalErrorHandler } from '@/src/lib/errorHandler';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Setup global error handlers for better error recovery
    try {
      setupGlobalErrorHandler();
      console.log('✅ ClientLayout: Error handlers initialized');
    } catch (error) {
      console.warn('⚠️ ClientLayout: Error handler setup failed:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-casino-dark via-casino-dark-lighter to-casino-dark">
      {/* Main content area - add padding-top for non-homepage to account for fixed navbar */}
      <main className={`min-h-screen ${!isHomePage ? 'pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
}