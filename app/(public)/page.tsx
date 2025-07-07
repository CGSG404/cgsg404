import { dehydrate, QueryClient } from "@tanstack/react-query";
import IndexHydrated from "@/components/IndexHydrated";
import { fetchFeaturedCasinos } from "@/lib/api";
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
  const queryClient = new QueryClient();

  // Prefetch data your IndexPage needs
  await queryClient.prefetchQuery({
    queryKey: ["featuredCasinos"],
    queryFn: fetchFeaturedCasinos,
  });

  const dehydrated = dehydrate(queryClient);

  return <IndexHydrated dehydratedState={dehydrated} />;
}
