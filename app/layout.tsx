import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import PerformanceMonitor from "@/src/components/PerformanceMonitor";
import AdminRedirect from "@/src/components/AdminRedirect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GuruSingapore - Your Ultimate Guide to Online Casinos & Bonuses",
  description: "Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling.",
  keywords: "casino singapore, online casino, casino bonus, free credit, casino guide, gambling singapore",
  authors: [{ name: "GuruSingapore Team" }],
  creator: "GuruSingapore",
  publisher: "GuruSingapore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gurusingapore.com"),
  alternates: {
    canonical: "/",
  },
  // PWA Configuration
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GuruSingapore",
    startupImage: [
      {
        url: "/icons/apple-splash-2048-2732.jpg",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/apple-splash-1668-2388.jpg",
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/apple-splash-1536-2048.jpg",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/apple-splash-1125-2436.jpg",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/icons/apple-splash-1242-2208.jpg",
        media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/icons/apple-splash-750-1334.jpg",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/icons/apple-splash-640-1136.jpg",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
  // Enhanced Mobile Optimization
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  openGraph: {
    title: "GuruSingapore - Your Ultimate Guide to Online Casinos & Bonuses",
    description: "Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling.",
    url: "/",
    siteName: "GuruSingapore",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GuruSingapore - Casino Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuruSingapore - Your Ultimate Guide to Online Casinos & Bonuses",
    description: "Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  // Additional SEO enhancements
  category: "entertainment",
  classification: "casino guide",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <PerformanceMonitor />
          <AdminRedirect />
          {children}
        </Providers>
      </body>
    </html>
  );
}
