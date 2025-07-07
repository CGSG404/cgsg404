"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import CasinosPage from "@/components/CasinosPage";
import { DehydratedState } from "@tanstack/react-query";

interface Props {
  dehydratedState: DehydratedState;
}

export default function CasinosHydrated({ dehydratedState }: Props) {
  return (
    <HydrationBoundary state={dehydratedState as any}>
      <CasinosPage />
    </HydrationBoundary>
  );
}
