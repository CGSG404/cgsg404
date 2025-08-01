import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search - CGSG | Find Casinos, Games, Reviews & More',
  description: 'Search across all CGSG pages for casinos, games, reviews, bonuses, guides, news, and more. Find exactly what you\'re looking for with our comprehensive search.',
  keywords: 'search, casino search, game search, review search, bonus search, guide search, news search, CGSG search',
  openGraph: {
    title: 'Search - CGSG | Find Casinos, Games, Reviews & More',
    description: 'Search across all CGSG pages for casinos, games, reviews, bonuses, guides, news, and more.',
    type: 'website',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 