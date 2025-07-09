// @ts-nocheck
import { supabaseServer } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateStaticParams() {
  const { data, error } = await supabaseServer
    .from("casinos")
    .select("slug")
    .neq("slug", null);

  if (error || !data) return [];
  return data.map(({ slug }) => ({ slug }));
}

type Props = {
  params: { slug: string };
  searchParams?: Record<string, string | string[]>;
};

export async function generateMetadata({ params }: Props) {
  const { data } = await supabaseServer
    .from("casinos")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!data)
    return {
      title: "Casino not found",
    };

  return {
    title: `${data.name} – Casino Guide`,
    description: data.description ?? undefined,
  };
}

export default async function CasinoPage({ params }: Props) {
  const { data, error } = await supabaseServer
    .from("casinos")
    .select("*, games(count)")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4 gradient-text">{data.name}</h1>
      {data.logo_url && (
        <Image
          src={data.logo_url}
          alt={`${data.name} logo`}
          width={200}
          height={100}
          className="mb-6"
        />
      )}
      <p className="mb-6 text-gray-300 max-w-3xl leading-relaxed">
        {data.description}
      </p>
      {data.games && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Games Available</h2>
          <p className="text-gray-400 mb-4">Total games: {data.games.count}</p>
          {/* Render games list/grid if you have relation */}
        </section>
      )}
    </main>
  );
}
