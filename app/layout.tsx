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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gurusingapore.com'),
  title: {
    default: 'CGSG - Casino & Gaming Guide',
    template: '%s | CGSG',
  },
  description: 'Your ultimate guide to online casinos and gaming.',
  openGraph: {
    title: 'CGSG - Casino & Gaming Guide',
    description: 'Your ultimate guide to online casinos and gaming.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gurusingapore.com',
    siteName: 'CGSG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CGSG Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CGSG - Casino & Gaming Guide',
    description: 'Your ultimate guide to online casinos and gaming.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

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
        {children}
      </body>
    </html>
  );
}
