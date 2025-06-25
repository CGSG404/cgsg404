
import { motion } from 'framer-motion';
import { Star, Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewsHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trusted Online Casino <span className="gradient-text">Reviews</span> by Real Players & Experts
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover honest, in-depth reviews of the top online casinos from experienced players and our team of experts. 
            Compare features, bonuses, customer support, and trust levels to make smarter choices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">Real Player Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Expert Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium">Detailed Comparisons</span>
            </div>
          </div>

          <Button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-8 py-3 text-lg">
            Browse All Reviews
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsHero;
