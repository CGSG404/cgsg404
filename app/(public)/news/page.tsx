import { Metadata } from "next";
import Link from "next/link";
import AnimatedBlurBG from "@/components/AnimatedBlurBG";
import NewsPage from "@/components/NewsPage";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Casino News | CGSG",
  description: "Latest updates and articles from CGSG and the gambling industry.",
};

export default function News() {
  return (
    <main className="relative overflow-hidden">
      <AnimatedBlurBG />
      <NewsPage />
    </main>
  );
}
