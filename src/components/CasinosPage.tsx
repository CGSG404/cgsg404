'use client';

import Footer from '@/components/Footer';
import CasinoListings from '@/components/CasinoListings';

const CasinosPage = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            All <span className="gradient-text">Casinos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse our complete database of online casinos with detailed reviews and safety ratings.
          </p>
        </div>
        <CasinoListings />
      </div>
      <Footer />
    </div>
  );
};

export default CasinosPage;
