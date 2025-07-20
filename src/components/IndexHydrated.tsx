"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import IndexPage from "@/src/components/IndexPage";

interface Props {
  dehydratedState: unknown;
}

export default function IndexHydrated({ dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <IndexPage />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
