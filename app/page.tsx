import React from 'react';
import { Metadata } from 'next';
import { JsonLd } from '../src/components/JsonLd';
import IndexPage from '../src/components/IndexPage';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com';
  
  return {
    title: 'GuruSingapore - Your Trusted Singapore Online Casino Guide',
    description: 'Find the best online casinos in Singapore with GuruSingapore. Expert reviews, exclusive bonuses, and trusted recommendations for safe online gaming.',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'GuruSingapore - Your Trusted Singapore Online Casino Guide',
      description: 'Find the best online casinos in Singapore with GuruSingapore. Expert reviews, exclusive bonuses, and trusted recommendations for safe online gaming.',
      url: siteUrl,
      siteName: 'GuruSingapore',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "GuruSingapore",
          "alternateName": "CGSG",
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://gurusingapore.com',
          "description": "Your trusted guide to online casinos in Singapore. Expert reviews, exclusive bonuses, and in-depth guides.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <IndexPage />
    </>
  );
} 