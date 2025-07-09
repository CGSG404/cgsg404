import { Metadata } from "next";
import NewsDetailPage from "@/components/NewsDetailPage";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `News ${id} | CGSG`,
  };
}

export default function NewsDetail() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Casino News Article",
    "url": "https://gurusingapore.com/news",
  } as const;
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsDetailPage />
    </>
  );
}
