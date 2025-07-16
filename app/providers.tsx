'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import LiveChat from '@/components/LiveChat';


export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
          <LiveChat />
        </TooltipProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
