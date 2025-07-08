import BestBonuses from "@/pages/BestBonuses";

export const revalidate = 3600;

export default function BestBonusesPage() {
  // Temporary: reuse existing client component sourced from pages folder.
  // Later we can move the component into src/components, but keeping import works for now.
  return <BestBonuses />;
}
