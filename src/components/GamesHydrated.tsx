"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import GamesPage from "@/components/GamesPage";

interface Props {
  dehydratedState: unknown;
}

export default function GamesHydrated({ dehydratedState }: Props) {
  return (
    <HydrationBoundary state={dehydratedState as any}>
      <GamesPage />
    </HydrationBoundary>
  );
}
