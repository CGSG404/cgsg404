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
    default: 'CGSG - CasinoGuru Singapore',
    template: '%s | CGSG',
  },
  description: 'Casino Guru Singapore (CGSG) is your trusted guide to the world of online casinos in Singapore. Explore expert reviews, exclusive bonuses, and in-depth guides to help you play smart and safe. Whether you are new or a seasoned player, CGSG brings you the best in online gaming.',
  openGraph: {
    title: 'CGSG - CasinoGuru Singapore.',
    description: 'Casino Guru Singapore (CGSG) is your trusted guide to the world of online casinos in Singapore. Explore expert reviews, exclusive bonuses, and in-depth guides to help you play smart and safe. Whether you are new or a seasoned player, CGSG brings you the best in online gaming.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com',
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
    title: 'CGSG - GuruSingapore',
    description: 'Casino Guru Singapore (CGSG) is your trusted guide to the world of online casinos in Singapore. Explore expert reviews, exclusive bonuses, and in-depth guides to help you play smart and safe. Whether you are new or a seasoned player, CGSG brings you the best in online gaming.',
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
