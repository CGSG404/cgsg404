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
  return <CasinosHydrated dehydratedState={dehydrated} />;
}
