import { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import GamesHydrated from "@/components/GamesHydrated";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Games | CGSG",
  description: "Browse popular casino game titles and guides.",
};

export default async function Games() {
  const queryClient = new QueryClient();
  // Future: prefetch top games / casinos here
  const dehydrated = dehydrate(queryClient);
  return <GamesHydrated dehydratedState={dehydrated} />;
}
