
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasinoSlideshow from '@/components/CasinoSlideshow';
import TopCasinosLeaderboard from '@/components/TopCasinosLeaderboard';
import { motion } from 'framer-motion';

const Games = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Top <span className="gradient-text">Casinos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the highest-rated casinos with the best bonuses, games, and player experiences.
          </p>
        </motion.div>
        
        {/* Casino Slideshow */}
        <CasinoSlideshow />
        
        {/* Top Casinos Leaderboard */}
        <TopCasinosLeaderboard />
      </div>
      <Footer />
    </div>
  );
};

export default Games;
