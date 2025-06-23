
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasinoSlideshow from '@/components/CasinoSlideshow';
import TopCasinosLeaderboard from '@/components/TopCasinosLeaderboard';

const Games = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Top <span className="gradient-text">Casinos</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the highest-rated casinos with the best bonuses, games, and player experiences.
          </p>
        </div>
        
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
