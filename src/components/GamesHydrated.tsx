"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import GamesPage from "@/components/GamesPage";

interface Props {
  dehydratedState: unknown;
}

export default function GamesHydrated({ dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState as any}>
        <GamesPage />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
