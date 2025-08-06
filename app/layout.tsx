import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import PerformanceMonitor from "@/src/components/PerformanceMonitor";
import GoogleAnalytics from "@/src/components/GoogleAnalytics";

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
  openGraph: {
    title: "GuruSingapore - Your Ultimate Guide to Online Casinos & Bonuses",
    description: "Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling.",
    url: "/",
    siteName: "GuruSingapore",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GuruSingapore - Your Ultimate Guide to Online Casinos & Bonuses",
    description: "Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <PerformanceMonitor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
