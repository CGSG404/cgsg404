"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";
import IndexPage from "@/src/components/IndexPage";

interface Props {
  dehydratedState: unknown;
}

export default function IndexHydrated({ dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - longer for casino data
        cacheTime: 10 * 60 * 1000, // 10 minutes cache
        retry: 2, // More retries for better reliability
        refetchOnWindowFocus: false, // Prevent unnecessary refetches
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <IndexPage />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
