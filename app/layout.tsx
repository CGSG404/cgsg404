import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { type ReactNode } from 'react';
import ClientLayout from './ClientLayout';
import Navbar from '@/src/components/NavbarNew';
import Providers from './providers';
import CookieConsent from '@/src/components/CookieConsent';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true, // Preload for better performance
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: false, // Don't preload mono font (less critical)
});

export const metadata: Metadata = {
  title: {
    default: 'CGSG - Casino Guide Singapore',
    template: '%s | CGSG',
  },
  description: 'Your trusted guide to online casinos in Singapore.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com'),

  // Performance and SEO optimizations
  keywords: ['casino', 'singapore', 'online casino', 'gambling', 'slots', 'poker'],
  authors: [{ name: 'CGSG Team' }],
  creator: 'CGSG',
  publisher: 'CGSG',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://gurusingapore.com',
    siteName: 'CGSG - Casino Guide Singapore',
    title: 'CGSG - Casino Guide Singapore',
    description: 'Your trusted guide to online casinos in Singapore.',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'CGSG - Casino Guide Singapore',
    description: 'Your trusted guide to online casinos in Singapore.',
  },

  // Performance hints
  other: {
    'theme-color': '#00ff99',
    'color-scheme': 'dark',
  },
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
        </Providers>
      </body>
    </html>
  );
}
