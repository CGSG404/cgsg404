import { Metadata } from "next";
import ReviewsPage from "@/components/ReviewsPage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Reviews | CGSG",
  description: "Read detailed reviews for casinos and games.",
};

export default function Reviews() {
  return <ReviewsPage />;
}
