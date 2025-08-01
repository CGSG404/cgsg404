'use client';

import { type ReactNode, useEffect } from 'react';
import { setupGlobalErrorHandler } from '@/src/lib/errorHandler';

export default function ClientLayout({ children }: { children: ReactNode }) {
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
      {/* Main content area - full width without sidebar */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}