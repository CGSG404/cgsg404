import Footer from '@/src/components/Footer';
import { casinos } from '@/src/data/casinos';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    slug: string;
    articleSlug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug, articleSlug } = params;
  const review = casinos.find((c) => c.slug === slug);
  const article = review?.articles?.find((a) => a.slug === articleSlug);

  if (!review || !article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} | ${review.name}`,
    description: article.summary,
    openGraph: {
      title: `${article.title} | ${review.name}`,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug, articleSlug } = params;

  // Cari review kasino berdasarkan slug
  const review = casinos.find((c) => c.slug === slug);

  // Jika review tidak ditemukan, tampilkan halaman 404
  if (!review) {
    console.error(`Review not found for slug: ${slug}`);
    notFound();
  }

  // Cari artikel berdasarkan articleSlug di dalam review
  const article = review.articles?.find((a) => a.slug === articleSlug);

  // Jika artikel tidak ditemukan, tampilkan halaman 404
  if (!article) {
    console.error(`Article not found for articleSlug: ${articleSlug}`);
    notFound();
  }

  return (
    <div className="bg-casino-dark text-white min-h-screen flex flex-col">
      <main className="flex-grow py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>{' '}
            &gt;
            <Link href="/reviews" className="hover:text-white transition-colors">
              Reviews
            </Link>{' '}
            &gt;
            <Link href={`/reviews/${slug}`} className="hover:text-white transition-colors">
              {review.name}
            </Link>{' '}
            &gt;
            <span className="text-white">{article.title}</span>
          </div>

          {/* Konten Artikel */}
          <article className="bg-[#181a20]/90 rounded-2xl shadow-2xl border border-casino-neon-green/15 p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-4">
              {article.title}
            </h1>

            {article.imageUrl && (
              <div className="my-6 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}

            {/* Konten utama artikel */}
            <div
              className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Back to Review Link */}
            <div className="mt-8 pt-8 border-t border-gray-700/50">
              <Link
                href={`/reviews/${slug}`}
                className="inline-flex items-center text-casino-neon-green hover:text-casino-neon-green/80 transition-colors"
              >
                <span>← Back to {review.name} Review</span>
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;

// Fungsi untuk generate static params agar Next.js bisa membuat halaman ini saat build
export async function generateStaticParams() {
  const paths = casinos.flatMap(
    (casino) =>
      casino.articles?.map((article) => ({
        slug: casino.slug,
        articleSlug: article.slug,
      })) ?? []
  );

  return paths;
}
