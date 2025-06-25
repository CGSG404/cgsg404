import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Shield, Users, Gift, Award } from 'lucide-react';

const stats = [
  { icon: <Shield className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '1+', label: 'Casinos Reviewed' },
  { icon: <Users className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '1+', label: 'Community Members' },
  { icon: <Gift className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '1+', label: 'Bonus Offers' },
  { icon: <Award className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '1%', label: 'Trust Score' }
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative text-center pt-20 pb-10 md:pt-32 md:pb-16">
      <div className="absolute inset-0 bg-casino-dark z-0" />

      {/* Background Glow */}
      <div className="absolute inset-0 z-10 blur-3xl">
        <div className="absolute -top-1/4 left-0 w-3/4 h-3/4 bg-casino-neon-green/30 rounded-full" />
        <div className="absolute -bottom-1/4 right-0 w-3/4 h-3/4 bg-casino-neon-purple/30 rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Your Trusted
            <br />
            <span className="text-casino-neon-green">Casino Guide</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Find the best online casinos, Live Reports, read honest reviews, and discover safe gambling platforms recommended by experts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-casino-neon-green text-casino-dark font-bold hover:bg-casino-neon-green/90 transition-colors px-8 py-6 text-base"
          >
            Find Best Casinos
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-6 text-base"
          >
            Read Reviews
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mt-12 md:mt-16 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center transition-all duration-300 hover:border-casino-neon-green/50 hover:scale-105">
                {stat.icon}
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
