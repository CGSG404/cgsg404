import { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import ReviewsHydrated from "@/components/ReviewsHydrated";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reviews | CGSG",
  description: "Read detailed reviews for casinos and games.",
};

export default async function Reviews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Casino Reviews",
    "description": "List of detailed casino reviews on GuruSingapore",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://gurusingapore.com/reviews/example-casino-1"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://gurusingapore.com/reviews/example-casino-2"
        }
      ]
    }
  };
  const queryClient = new QueryClient();
  // Future: prefetch reviews data here
  const dehydrated = dehydrate(queryClient);
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewsHydrated dehydratedState={dehydrated} />
    </>
  );
}
