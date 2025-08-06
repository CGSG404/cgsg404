import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gurusingapore.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CasinoGuru Singapore - Trusted Online Casino Reviews & Bonuses',
    template: '%s | CasinoGuru Singapore'
  },
  description: 'Find the best online casinos in Singapore with expert reviews, exclusive bonuses, and safety ratings. Your trusted source for casino gaming.',
  keywords: ['online casino Singapore', 'casino reviews', 'casino bonuses', 'trusted casinos', 'safe gambling Singapore'],
  authors: [{ name: 'CasinoGuru Singapore' }],
  creator: 'CasinoGuru Singapore',
  publisher: 'CasinoGuru Singapore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: siteUrl,
    siteName: 'CasinoGuru Singapore',
    title: 'CasinoGuru Singapore - Trusted Online Casino Reviews & Bonuses',
    description: 'Find the best online casinos in Singapore with expert reviews, exclusive bonuses, and safety ratings.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CasinoGuru Singapore'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CasinoGuru Singapore - Trusted Online Casino Reviews & Bonuses',
    description: 'Find the best online casinos in Singapore with expert reviews, exclusive bonuses, and safety ratings.',
    site: '@casinogurusg',
    creator: '@casinogurusg',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#00ff9a' }
    ]
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteUrl
  }
};

// Structured data for homepage
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CasinoGuru Singapore',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: 'Your trusted source for online casino reviews and gambling advice in Singapore',
  sameAs: [
    'https://twitter.com/casinogurusg',
    'https://facebook.com/casinogurusg',
    'https://t.me/ysfcreatorr'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+65-XXXX-XXXX',
    contactType: 'customer service',
    availableLanguage: ['English', 'Chinese', 'Malay', 'Tamil']
  }
};

// Website schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CasinoGuru Singapore',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
};

// Breadcrumb schema generator
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// Review schema generator for casino reviews
export const generateCasinoReviewSchema = (casino: {
  name: string;
  rating: number;
  description: string;
  image: string;
  reviewCount?: number;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Organization',
      name: casino.name,
      image: casino.image,
      description: casino.description
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: casino.rating,
      bestRating: 5,
      worstRating: 1
    },
    author: {
      '@type': 'Organization',
      name: 'CasinoGuru Singapore'
    },
    reviewBody: casino.description,
    publisher: {
      '@type': 'Organization',
      name: 'CasinoGuru Singapore',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    }
  };
};

// FAQ schema generator
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};