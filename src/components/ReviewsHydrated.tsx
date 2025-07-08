"use client";

import { HydrationBoundary } from "@tanstack/react-query";
import ReviewsPage from "@/components/ReviewsPage";

interface Props {
  dehydratedState: unknown;
}

export default function ReviewsHydrated({ dehydratedState }: Props) {
  return (
    <HydrationBoundary state={dehydratedState as any}>
      <ReviewsPage />
    </HydrationBoundary>
  );
}
