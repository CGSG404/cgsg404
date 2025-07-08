import { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import ReviewsHydrated from "@/components/ReviewsHydrated";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reviews | CGSG",
  description: "Read detailed reviews for casinos and games.",
};

export default async function Reviews() {
  const queryClient = new QueryClient();
  // Future: prefetch reviews data here
  const dehydrated = dehydrate(queryClient);
  return <ReviewsHydrated dehydratedState={dehydrated} />;
}
