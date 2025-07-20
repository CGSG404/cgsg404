import { dehydrate, QueryClient } from "@tanstack/react-query";
import IndexHydrated from "@/src/components/IndexHydrated";
import IndexPage from "@/src/components/IndexPage";
import AuthErrorHandler from "@/src/components/AuthErrorHandler";
import SimpleErrorBoundary from "@/src/components/SimpleErrorBoundary";
import { fetchFeaturedCasinos, fetchTopCasinos } from "@/src/lib/api";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-static";

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
    <SimpleErrorBoundary>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="text-white p-4">Loading auth handler...</div>}>
        <AuthErrorHandler />
      </Suspense>
      <Suspense fallback={<div className="text-white p-4">Loading page...</div>}>
        <IndexHydrated dehydratedState={dehydrated} />
      </Suspense>
    </SimpleErrorBoundary>
  );
}
