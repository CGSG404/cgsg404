import { casinos } from "@/src/data/casinos";
import { notFound } from "next/navigation";
import ReviewDetail from "@/src/components/ReviewDetail";
import { Metadata } from "next";

interface CasinoPageProps {
  params: { slug: string };
}

// Fungsi untuk menghasilkan metadata dinamis
export async function generateMetadata({
  params,
}: CasinoPageProps): Promise<Metadata> {
  const { slug } = params;
  const casino = casinos.find((c) => c.slug === slug);

  if (!casino) {
    return {
      title: "Casino Not Found",
    };
  }

  return {
    title: `${casino.name} Review | Expert Ratings & Bonus Info`,
    description: `In-depth review of ${casino.name}. Get details on games, bonuses, security, and more.`,
  };
}

const CasinoPage = ({ params }: CasinoPageProps) => {
  const casino = casinos.find((c) => c.slug === params.slug);

  if (!casino) {
    notFound();
  }

  // Karena halaman ini sekarang hanya wrapper, kita bisa langsung render ReviewDetail
  // Pastikan tipe data 'casino' cocok dengan yang diharapkan oleh 'ReviewDetail'
  return <ReviewDetail review={casino} />;
};

export default CasinoPage;

// Fungsi untuk menghasilkan path statis saat build
export async function generateStaticParams() {
  return casinos.map((casino) => ({
    slug: casino.slug,
  }));
}
