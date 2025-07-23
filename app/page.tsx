import { dehydrate, QueryClient } from "@tanstack/react-query";
import IndexHydrated from "@/src/components/IndexHydrated";
import IndexPage from "@/src/components/IndexPage";
import AuthErrorHandler from "@/src/components/AuthErrorHandler";
import SimpleErrorBoundary from "@/src/components/SimpleErrorBoundary";
import { fetchFeaturedCasinos, fetchTopCasinos } from "@/src/lib/api";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour ISR - perfect for casino data updates
export const runtime = 'edge'; // Edge Runtime for global performance
export const preferredRegion = ['sin1', 'hkg1', 'syd1']; // Asia-Pacific regions for casino audience

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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
      },
    },
  });

  // Prefetch critical data with error handling
  try {
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: ["featuredCasinos"],
        queryFn: fetchFeaturedCasinos,
      }),
      queryClient.prefetchQuery({
        queryKey: ["topCasinos"],
        queryFn: () => fetchTopCasinos(10),
      }),
    ]);
  } catch (error) {
    // Log error but don't break the page - fallback data will be used
    console.error("Failed to prefetch data:", error);
  }

  const dehydrated = dehydrate(queryClient);

  return (
    <SimpleErrorBoundary>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen bg-casino-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
            <p className="text-white text-sm">Initializing...</p>
          </div>
        </div>
      }>
        <AuthErrorHandler />
      </Suspense>
      <Suspense fallback={
        <div className="min-h-screen bg-casino-dark">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-16 bg-casino-card-bg border-b border-casino-border-subtle"></div>

            {/* Hero banner skeleton */}
            <div className="h-[340px] md:h-[520px] lg:h-[600px] bg-gradient-to-r from-casino-card-bg to-gray-700"></div>

            {/* Hero section skeleton */}
            <div className="py-20 px-4">
              <div className="container mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <div className="h-12 md:h-16 bg-casino-card-bg rounded w-3/4 mx-auto"></div>
                  <div className="h-6 bg-casino-card-bg rounded w-1/2 mx-auto"></div>
                </div>
                <div className="flex gap-4 justify-center">
                  <div className="h-12 bg-casino-neon-green/20 rounded w-32"></div>
                  <div className="h-12 bg-casino-card-bg rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Casino slider skeleton */}
            <div className="py-12 px-4">
              <div className="container mx-auto">
                <div className="h-8 bg-casino-card-bg rounded w-48 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-64 bg-casino-card-bg rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }>
        <IndexHydrated dehydratedState={dehydrated} />
      </Suspense>
    </SimpleErrorBoundary>
  );
}
