import { Metadata } from "next";
import Link from "next/link";
import AnimatedBlurBG from "@/components/AnimatedBlurBG";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import GamesHydrated from "@/components/GamesHydrated";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Top Casinos | CGSG",
  description: "Browse popular casino game titles and guides.",
};

export default async function Games() {
  const queryClient = new QueryClient();
  // Future: prefetch top games / casinos here
  const dehydrated = dehydrate(queryClient);
  return (
    <main className="relative overflow-hidden">
      <AnimatedBlurBG />
      <GamesHydrated dehydratedState={dehydrated} />
    </main>
  );
}
