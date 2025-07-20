'use client';

import ReviewsHydrated from '@/src/components/ReviewsHydrated';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export default function ReviewsClient() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Casino Reviews',
    description: 'List of detailed casino reviews on GuruSingapore',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: 'https://gurusingapore.com/reviews/example-casino-1',
        },
        {
          '@type': 'ListItem',
          position: 2,
          url: 'https://gurusingapore.com/reviews/example-casino-2',
        },
      ],
    },
  };

  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewsHydrated dehydratedState={dehydratedState} />
    </>
  );
}
