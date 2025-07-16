import BestBonuses from "@/pages/BestBonuses";
import AnimatedBlurBG from "@/components/AnimatedBlurBG";
import Link from "next/link";

export const revalidate = 3600;

export default function BestBonusesPage() {
  // Temporary: reuse existing client component sourced from pages folder.
  // Later we can move the component into src/components, but keeping import works for now.
  return (
    <main className="relative overflow-hidden">
      <AnimatedBlurBG />
      <BestBonuses />
    </main>
  );
}
