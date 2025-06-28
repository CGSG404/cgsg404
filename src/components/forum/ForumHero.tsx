import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ForumHero = () => {
  return (
    <div className="relative py-20 bg-gradient-to-br from-casino-dark via-casino-card-bg to-casino-dark">
      <div className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/5 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Casino</span> <span className="gradient-text">Community Forum</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of players discussing strategies, sharing experiences, and helping each other win big!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="inline-flex">
              <Button
                className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Join the Discussion
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green/10 w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
              onClick={() => {
                const section = document.getElementById('featured-topics');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Topics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumHero;