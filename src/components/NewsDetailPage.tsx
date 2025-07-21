'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';

// NOTE: in production replace this with API fetching; for demo reuse static list
const newsArticles = [
  {
    id: '1',
    title: 'CGSG Domain Officially Launched: Marking a New Era of Safer and More Trusted Online Gambling',
    content:
      'Singapore July 2 2025 – CGSG (Casino Gaming Singapore Group) has officially launched its new domain marking a major milestone in the organizations commitment to a safer, more responsible, and strictly regulated online gambling industry. With this launch, CGSG is introducing a new standard across its ecosystem, emphasizing enhanced player protection and stricter licensing requirements for all partner platforms. Key features such as advanced identity verification, responsible gaming controls, and real-time activity monitoring are now mandatory for all operational partners. This domain launch is more than just a new digital identity — it symbolizes a broader industry transformation toward transparency, integrity, and social responsibility In addition to improving safety and player experience, CGSG is tightening its licensing process through regular audits, legal verification of operations, and ethical assessments for every operator seeking to join its network, This domain launch represents the first step in a series of major updates that CGSG is implementing as part of its serious commitment to building a sustainable and trusted online gambling ecosystem.',
    author: 'Moderator CGSG',
    date: 'July 2, 2025',
    category: 'CGSG',
    image: `/news-banner/domain1.png`,
    readTime: 'CGSG News',
  },
  {
    id: '2',
    title: 'Coming Soon',
    content:
      'Coming Soon.',
    author: 'Moderator CGSG',
    date: 'July 2, 2025',
    category: 'Gaming',
    image: `/news-banner/coming-soon.png`,
    readTime: 'CGSG News',
  },
];

const NewsDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id?: string }>();
  const id = params?.id || searchParams?.get('id');
  if (!id) {
    router.push('/404');
    return null;
  }

  const article = useMemo(() => newsArticles.find((a) => a.id === id), [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-casino-dark text-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/news" className="text-casino-neon-green hover:underline">
            Return to News List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark text-white">
      <Head>
        <title>{article.title} | Casino News</title>
      </Head>
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Link href="/news" className="flex items-center gap-2 text-sm text-casino-neon-green mb-6 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to News
        </Link>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-6">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {article.date}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="w-4 h-4" /> {article.category}
          </span>
          <span>{article.readTime}</span>
        </div>

        <Image src={article.image} alt={article.title} width={800} height={240} className="w-full h-60 object-cover rounded-lg mb-8" unoptimized />

        <article className="prose prose-invert max-w-none md:prose-lg">
          <p>{article.content}</p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;
