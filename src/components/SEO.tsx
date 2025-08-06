'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'CasinoGuru Singapore - Trusted Online Casino Reviews & Bonuses',
  description = 'Find the best online casinos in Singapore with expert reviews, exclusive bonuses, and safety ratings. Your trusted source for casino gaming.',
  keywords = 'online casino Singapore, casino reviews, casino bonuses, trusted casinos, safe gambling Singapore',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  structuredData
}) => {
  const pathname = usePathname();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gurusingapore.com';
  const fullUrl = canonicalUrl || `${siteUrl}${pathname}`;

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CasinoGuru Singapore",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Your trusted source for online casino reviews and gambling advice in Singapore",
    "sameAs": [
      "https://twitter.com/casinogurusg",
      "https://facebook.com/casinogurusg",
      "https://t.me/ysfcreatorr"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+65-XXXX-XXXX",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese", "Malay"]
    }
  };

  const jsonLd = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta charSet="utf-8" />
      
      {/* Robots Meta */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="CasinoGuru Singapore" />
      <meta property="og:locale" content="en_SG" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:site" content="@casinogurusg" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="CasinoGuru Singapore" />
      <meta name="publisher" content="CasinoGuru Singapore" />
      <meta name="copyright" content="CasinoGuru Singapore" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Preconnect to optimize loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
    </Head>
  );
};

export default SEO;