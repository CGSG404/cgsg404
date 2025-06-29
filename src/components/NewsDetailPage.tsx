import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { Calendar, User, Tag, ChevronLeft } from 'lucide-react';

// NOTE: in production replace this with API fetching; for demo reuse static list
const newsArticles = [
  {
    id: '1',
    title: 'New Online Casino Regulations Set to Launch in 2024',
    content:
      'Full article content here. Major changes coming to the online gambling industry with enhanced player protection measures and stricter licensing requirements. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    author: 'Casino Expert Team',
    date: 'December 15, 2024',
    category: 'Regulation',
    image: '/placeholder.svg',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Top 10 Casino Bonuses This Month',
    content:
      'Full article content here. Discover the most generous welcome bonuses and promotional offers available at leading online casinos. Donec ullamcorper nulla non metus auctor fringilla.',
    author: 'Bonus Hunter',
    date: 'December 12, 2024',
    category: 'Bonuses',
    image: '/placeholder.svg',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: 'Cryptocurrency Gambling: The Future is Here',
    content:
      'Full article content here. How Bitcoin and other cryptocurrencies are revolutionizing online casino payments and what it means for players. Cras mattis consectetur purus sit amet fermentum.',
    author: 'Tech Analyst',
    date: 'December 10, 2024',
    category: 'Technology',
    image: '/placeholder.svg',
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'Live Dealer Games: Bridging Online and Land-Based Casinos',
    content:
      "Full article content here. The rise of live dealer technology and how it's creating more immersive gaming experiences.",
    author: 'Game Reviewer',
    date: 'December 8, 2024',
    category: 'Games',
    image: '/placeholder.svg',
    readTime: '7 min read',
  },
  {
    id: '5',
    title: 'Mobile Casino Gaming Statistics 2024',
    content:
      'Full article content here. Latest data shows mobile gaming now accounts for over 60% of all online casino activity worldwide.',
    author: 'Data Team',
    date: 'December 5, 2024',
    category: 'Industry',
    image: '/placeholder.svg',
    readTime: '4 min read',
  },
];

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const article = useMemo(() => newsArticles.find((a) => a.id === id), [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-casino-dark text-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/news" className="text-casino-neon-green hover:underline">
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
      <Navbar />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Link to="/news" className="flex items-center gap-2 text-sm text-casino-neon-green mb-6 hover:underline">
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

        <img src={article.image} alt={article.title} className="w-full h-60 object-cover rounded-lg mb-8" />

        <article className="prose prose-invert max-w-none md:prose-lg">
          <p>{article.content}</p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;
