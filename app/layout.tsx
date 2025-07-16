import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com'),
  title: {
    default: 'GuruSingapore',
    template: '%s | GuruSingapore',
  },
  description: 'GuruSingapore (CGSG) is your trusted guide to the world of online casinos in Singapore. Explore expert reviews, exclusive bonuses, and in-depth guides to help you play smart and safe. Whether you are new or a seasoned player, CGSG brings you the best in online gaming.',
  openGraph: {
    title: 'GuruSingapore',
    description: 'GuruSingapore (CGSG) is your trusted guide to the world of online casinos in Singapore. Explore expert reviews, exclusive bonuses, and in-depth guides to help you play smart and safe. Whether you are new or a seasoned player, CGSG brings you the best in online gaming.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com',
    siteName: 'GuruSingapore',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'GuruSingapore',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GuruSingapore',
    description: 'GuruSingapore (CGSG) is your trusted guide to the world of online casinos in Singapore. Explore expert reviews, exclusive bonuses, and in-depth guides to help you play smart and safe. Whether you are new or a seasoned player, CGSG brings you the best in online gaming.',
    images: ['/favicon.ico'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import Providers from './providers';
import dynamic from 'next/dynamic';
const BackToTop = dynamic(() => import('@/components/BackToTop'));
import AnimatedBlurBG from '@/components/AnimatedBlurBG';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnimatedBlurBG />
        <Providers>
          {children}
        </Providers>
        <BackToTop />
      </body>
    </html>
  );
}
