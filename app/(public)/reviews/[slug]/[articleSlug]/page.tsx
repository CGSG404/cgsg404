import { casinos } from '@/data/casinos';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ArticlePageProps {
  params: {
    slug: string;
    articleSlug: string;
  };
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug, articleSlug } = params;

  // Cari review kasino berdasarkan slug
  const review = casinos.find((c) => c.slug === slug);

  // Jika review tidak ditemukan, tampilkan halaman 404
  if (!review) {
    notFound();
  }

  // Cari artikel berdasarkan articleSlug di dalam review
  const article = review.articles?.find((a) => a.slug === articleSlug);

  // Jika artikel tidak ditemukan, tampilkan halaman 404
  if (!article) {
    notFound();
  }

  return (
    <div className="bg-casino-dark text-white">
      <Navbar />
      <main className="min-h-screen py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> &gt; 
            <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link> &gt; 
            <Link href={`/reviews/${slug}`} className="hover:text-white transition-colors">{review.name}</Link> &gt; 
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
                />
              </div>
            )}

            {/* Konten utama artikel, di-render sebagai HTML */}
            <div 
              className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
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
  const paths = casinos.flatMap(casino => 
    casino.articles?.map(article => ({
      slug: casino.slug,
      articleSlug: article.slug,
    })) ?? []
  );

  return paths;
}
