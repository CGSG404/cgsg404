import { motion } from 'framer-motion';
import { BookOpen, Shield, Target } from 'lucide-react';


const GuideHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-casino-dark via-casino-dark-lighter to-casino-dark">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Casino</span> <span className="gradient-text">Guide</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how to play smarter, safer, and better. Our comprehensive guides on online casinos, games, and strategies are coming soon!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-casino-neon-green">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Expert Guides</span>
            </div>
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Safe Play Tips</span>
            </div>
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Winning Strategies</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuideHero;
