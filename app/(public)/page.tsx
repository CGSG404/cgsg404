import { dehydrate, QueryClient } from "@tanstack/react-query";
import IndexHydrated from "@/components/IndexHydrated";
import { fetchFeaturedCasinos, fetchTopCasinos } from "@/lib/api";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 600; // 10 minutes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Casino Singapore | GuruSingapore",
    description:
      "Find Your Trusted Casino Singapore, Best Event, Information Active, and Forum Report",
    openGraph: {
      title: "Your Trusted Casino Guide",
      description: "Find Your Trusted Casino Singapore.",
      url: "https://gurusingapore.com",
      type: "website",
    },
  };
}

export default async function Home() {
  console.log("Rendering Home page...");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GuruSingapore Casino Guide",
    "url": "https://gurusingapore.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gurusingapore.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  const queryClient = new QueryClient();

  // Prefetch data your IndexPage needs
  await queryClient.prefetchQuery({
    queryKey: ["featuredCasinos"],
    queryFn: fetchFeaturedCasinos,
  });

  await queryClient.prefetchQuery({
    queryKey: ["topCasinos"],
    queryFn: () => fetchTopCasinos(10),
  });

  const dehydrated = dehydrate(queryClient);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndexHydrated dehydratedState={dehydrated} />
    </>
  );
}
