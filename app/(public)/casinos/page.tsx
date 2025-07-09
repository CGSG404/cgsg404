import { Metadata } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchAllCasinos } from "@/lib/api";
import CasinosHydrated from "@/components/CasinosHydrated";

export const revalidate = 3600; // 1h – static for now

export const metadata: Metadata = {
  title: "All Casinos | CGSG",
  description: "Browse our complete database of online casinos with detailed reviews and safety ratings.",
};

export default async function Casinos() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["casinos"],
    queryFn: fetchAllCasinos,
  });

  const dehydrated = dehydrate(queryClient);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Online Casinos",
    "description": "Complete list of online casinos reviewed by GuruSingapore",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://gurusingapore.com/casinos/example-casino-1"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://gurusingapore.com/casinos/example-casino-2"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CasinosHydrated dehydratedState={dehydrated} />
    </>
  );
}
