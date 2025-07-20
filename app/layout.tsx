import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { type ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import Navbar from '@/src/components/Navbar';
import Providers from './providers';
import CookieConsent from '@/src/components/CookieConsent';
import { AdminDebugWidget } from '@/src/components/admin/AdminDebugWidget';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'CGSG - Casino Guide Singapore',
    template: '%s | CGSG',
  },
  description: 'Your trusted guide to online casinos in Singapore.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#0e181c] via-[#0e181c]/90 to-black min-h-screen`}
      >
        <Providers>
          <Navbar />
          <ClientLayout>{children}</ClientLayout>
          <CookieConsent />
          <AdminDebugWidget />
        </Providers>
      </body>
    </html>
  );
}
