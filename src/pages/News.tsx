
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, Tag } from 'lucide-react';

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title: "New Online Casino Regulations Set to Launch in 2024",
      excerpt: "Major changes coming to the online gambling industry with enhanced player protection measures and stricter licensing requirements.",
      author: "Casino Expert Team",
      date: "December 15, 2024",
      category: "Regulation",
      image: "/placeholder.svg",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Top 10 Casino Bonuses This Month",
      excerpt: "Discover the most generous welcome bonuses and promotional offers available at leading online casinos.",
      author: "Bonus Hunter",
      date: "December 12, 2024",
      category: "Bonuses",
      image: "/placeholder.svg",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Cryptocurrency Gambling: The Future is Here",
      excerpt: "How Bitcoin and other cryptocurrencies are revolutionizing online casino payments and what it means for players.",
      author: "Tech Analyst",
      date: "December 10, 2024",
      category: "Technology",
      image: "/placeholder.svg",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Live Dealer Games: Bridging Online and Land-Based Casinos",
      excerpt: "The rise of live dealer technology and how it's creating more immersive gaming experiences.",
      author: "Game Reviewer",
      date: "December 8, 2024",
      category: "Games",
      image: "/placeholder.svg",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Mobile Casino Gaming Statistics 2024",
      excerpt: "Latest data shows mobile gaming now accounts for over 60% of all online casino activity worldwide.",
      author: "Data Team",
      date: "December 5, 2024",
      category: "Industry",
      image: "/placeholder.svg",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Responsible Gambling: Tools and Resources",
      excerpt: "A comprehensive guide to staying safe while enjoying online casino games and recognizing warning signs.",
      author: "Safety Expert",
      date: "December 3, 2024",
      category: "Safety",
      image: "/placeholder.svg",
      readTime: "10 min read"
    }
  ];

  const categories = ["All", "Regulation", "Bonuses", "Technology", "Games", "Industry", "Safety"];

  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Casino <span className="gradient-text">News</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news, trends, and developments in the online casino industry.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-casino-card-bg border border-casino-border-subtle text-gray-300 hover:text-casino-neon-green hover:border-casino-neon-green/30 transition-all duration-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <div className="mb-16">
          <div className="bg-casino-card-bg rounded-lg border border-casino-border-subtle overflow-hidden card-hover">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={newsArticles[0].image} 
                  alt={newsArticles[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-casino-neon-green/20 text-casino-neon-green rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-casino-border-subtle text-gray-300 rounded-full text-sm">
                    {newsArticles[0].category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white hover:text-casino-neon-green transition-colors cursor-pointer">
                  {newsArticles[0].title}
                </h2>
                <p className="text-gray-400 mb-6">
                  {newsArticles[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{newsArticles[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{newsArticles[0].date}</span>
                  </div>
                  <span>{newsArticles[0].readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.slice(1).map((article) => (
            <div key={article.id}>
              <article className="bg-casino-card-bg rounded-lg border border-casino-border-subtle overflow-hidden card-hover cursor-pointer">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-casino-neon-green" />
                    <span className="text-casino-neon-green text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white hover:text-casino-neon-green transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {article.readTime}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        
      </div>
      <Footer />
    </div>
  );
};

export default News;
