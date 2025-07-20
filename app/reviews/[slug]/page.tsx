import { notFound } from "next/navigation";
import Link from "next/link";
import ReviewDetail from "@/src/components/ReviewDetail";
import Footer from "@/src/components/Footer";
import { type Review } from "@/src/components/ReviewDetail/types";
import { casinos } from "@/src/data/casinos";

// -------- METADATA ---------
export async function generateMetadata(props: { params: { slug: string } }) {
  const { params } = props;
  const review = casinos.find((r) => r.slug === params.slug);
  if (!review) return {};
  
  return {
    title: `${review.name} – Casino Review`,
    description: `Detailed review of ${review.name} including bonuses, games, and player feedback`,
  };
}

// ---------- PAGE COMPONENT --------------
export default async function ReviewPage(props: { params: { slug: string } }) {
  const { params } = props;
  const review = casinos.find((r) => r.slug === params.slug);
  
  if (!review) {
    notFound();
    return null;
  }

  return (
    <>
      <main className="min-h-screen py-8 px-2 relative overflow-hidden">
        <div className="max-w-4xl mx-auto p-4 md:p-8">

          <ReviewDetail review={review} />
        </div>
      </main>
      <Footer />
    </>
  );
}