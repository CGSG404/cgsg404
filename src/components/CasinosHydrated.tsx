"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import CasinosPage from "@/components/CasinosPage";
import { DehydratedState } from "@tanstack/react-query";

interface Props {
  dehydratedState: DehydratedState;
}

export default function CasinosHydrated({ dehydratedState }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState as any}>
        <CasinosPage />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
