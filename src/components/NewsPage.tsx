import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, User, Tag } from 'lucide-react';

const NewsPage = () => {
// Semua logic dan UI utama News sudah di sini.

  const [selectedCategory, setSelectedCategory] = useState('All');

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
  ];

  // ...rest of News logic and JSX
  return (
    <div className="min-h-screen bg-casino-dark">
      <Head>
        <title>Casino News</title>
      </Head>
      <Navbar />
      {/* News content here */}
      <Footer />
    </div>
  );
};

export default NewsPage;
