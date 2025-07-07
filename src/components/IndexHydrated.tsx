"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import IndexPage from "@/components/IndexPage";

interface Props {
  dehydratedState: unknown;
}

export default function IndexHydrated({ dehydratedState }: Props) {
  return (
    <HydrationBoundary state={dehydratedState as any}>
      <IndexPage />
    </HydrationBoundary>
  );
}
