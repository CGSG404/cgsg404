import { useState, useMemo } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  // List of news articles (in a real app this would come from an API)
  const newsArticles = [
    {
      id: 1,
      title: 'New Online Casino Regulations Set to Launch in 2024',
      excerpt:
        'Major changes coming to the online gambling industry with enhanced player protection measures and stricter licensing requirements.',
      author: 'Casino Expert Team',
      date: 'December 15, 2024',
      category: 'Regulation',
      image: '/placeholder.svg',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Top 10 Casino Bonuses This Month',
      excerpt:
        'Discover the most generous welcome bonuses and promotional offers available at leading online casinos.',
      author: 'Bonus Hunter',
      date: 'December 12, 2024',
      category: 'Bonuses',
      image: '/placeholder.svg',
      readTime: '8 min read',
    },
    {
      id: 3,
      title: 'Cryptocurrency Gambling: The Future is Here',
      excerpt:
        'How Bitcoin and other cryptocurrencies are revolutionizing online casino payments and what it means for players.',
      author: 'Tech Analyst',
      date: 'December 10, 2024',
      category: 'Technology',
      image: '/placeholder.svg',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Live Dealer Games: Bridging Online and Land-Based Casinos',
      excerpt:
        "The rise of live dealer technology and how it's creating more immersive gaming experiences.",
      author: 'Game Reviewer',
      date: 'December 8, 2024',
      category: 'Games',
      image: '/placeholder.svg',
      readTime: '7 min read',
    },
    {
      id: 5,
      title: 'Mobile Casino Gaming Statistics 2024',
      excerpt:
        'Latest data shows mobile gaming now accounts for over 60% of all online casino activity worldwide.',
      author: 'Data Team',
      date: 'December 5, 2024',
      category: 'Industry',
      image: '/placeholder.svg',
      readTime: '4 min read',
    },
  ];

  const categories = useMemo(() => ['All', ...new Set(newsArticles.map((n) => n.category))], [newsArticles]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredArticles =
    selectedCategory === 'All'
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-casino-dark text-white">
      <Head>
        <title>Casino News</title>
      </Head>
      <Navbar />

      <section className="container mx-auto px-4 py-16">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Latest <span className="gradient-text">News</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the newest developments in the online casino world.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border border-casino-border-subtle transition-colors duration-200 text-sm md:text-base ${
                selectedCategory === category
                  ? 'bg-casino-neon-green text-casino-dark'
                  : 'bg-transparent text-gray-300 hover:bg-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-casino-card-bg/60 border border-casino-border-subtle rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
              <div className="p-6 flex flex-col gap-4">
                <h2 className="text-xl font-semibold line-clamp-2 min-h-[56px]">
                  {article.title}
                </h2>

                <p className="text-gray-400 text-sm line-clamp-3 min-h-[72px]">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" /> {article.category}
                  </span>
                </div>

                <Link
                  to={`/news/${article.id}`}
                  className="mt-2 inline-block text-casino-neon-green hover:underline text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsPage;
