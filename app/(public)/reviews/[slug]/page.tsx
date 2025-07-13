import { notFound } from "next/navigation";
import ReviewDetail from "@/components/ReviewDetail";
import { type Review } from "@/components/ReviewDetail/types";
import { casinos } from "@/data/casinos";

// -------- METADATA ---------
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const review = casinos.find((r) => r.slug === params.slug);
  if (!review) return {};
  
  return {
    title: `${review.name} – Casino Review`,
    description: `Detailed review of ${review.name} including bonuses, games, and player feedback`,
  };
}

// ---------- PAGE COMPONENT --------------
export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const review = casinos.find((r) => r.slug === params.slug);
  
  if (!review) {
    notFound();
    return null; // Return null to satisfy TypeScript
  }

  return <ReviewDetail review={review} />;
}