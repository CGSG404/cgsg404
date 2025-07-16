"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import ReviewsPage from "@/components/ReviewsPage";

interface Props {
  dehydratedState: unknown;
}

export default function ReviewsHydrated({ dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState as any}>
        <ReviewsPage />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
