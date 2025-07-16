"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";
import IndexPage from "@/components/IndexPage";

interface Props {
  dehydratedState: unknown;
}

export default function IndexHydrated({ dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <IndexPage />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
