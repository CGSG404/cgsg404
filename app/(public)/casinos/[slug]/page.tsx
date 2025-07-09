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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

type Props = {
  params: { slug: string };
  searchParams?: Record<string, string | string[]>;
};

export async function generateMetadata({ params }: Props) {
  const url = `${SITE_URL}/casinos/${params.slug}`;
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
    title: `${data.name} – Guru Singapore`,
    description: data.description ?? undefined,
    keywords: `${data.name}, online casino singapore, guru singapore, casino singapore`,
    openGraph: {
      title: `${data.name} – Online Casino Guide`,
      description: data.description ?? undefined,
      url,
      siteName: "CGSG | CasinoGuru Singapore",
      images: data.logo_url
        ? [
            {
              url: data.logo_url,
              width: 800,
              height: 400,
              alt: `${data.name} logo`,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} – Online Casino Singapore`,
      description: data.description ?? undefined,
      images: data.logo_url ? [data.logo_url] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

import Script from "next/script";

export default async function CasinoPage({ params }: Props) {
  const { data, error } = await supabaseServer
    .from("casinos")
    .select("*, games(count)")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return notFound();
  }

  const pageUrl = `${SITE_URL}/casinos/${params.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Casino",
    name: data.name,
    url: pageUrl,
    description: data.description,
    image: data.logo_url,
  };

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
          <Script
        id="casino-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
