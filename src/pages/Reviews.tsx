
import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewsHero from '@/components/reviews/ReviewsHero';
import ReviewsGrid from '@/components/reviews/ReviewsGrid';
import ReviewsCTA from '@/components/reviews/ReviewsCTA';
import { Search } from 'lucide-react';

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-casino-dark">
      <Head>
        <title>Online Casino Reviews - Expert Ratings & Reports | CGSG</title>
        <meta name="description" content="Read our in-depth online casino reviews. We provide expert ratings on games, bonuses, security, and customer support to help you choose the best casino." />
      </Head>
      <Navbar />
      
      <ReviewsHero />
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a casino review by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-16 text-lg bg-casino-card-bg border border-casino-border-subtle rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-casino-neon-green/50 transition-all duration-300"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </div>

          <ReviewsGrid searchQuery={searchQuery} />
          <ReviewsCTA />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reviews;

export async function getStaticProps() {
  return { props: {}, revalidate: 1800 };
}

