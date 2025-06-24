import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Users, Gift, Award } from 'lucide-react';
import CountUp from 'react-countup';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const scrollToCasinos = () => {
    const element = document.getElementById('top-casinos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const stats = [
    { icon: Shield, value: '1+', label: 'Casinos Reviewed', color: 'text-casino-neon-green' },
    { icon: Users, value: '1+', label: 'Community Members', color: 'text-blue-400' },
    { icon: Gift, value: '1+', label: 'Bonus Offers', color: 'text-casino-neon-purple' },
    { icon: Award, value: '1%', label: 'Trust Score', color: 'text-yellow-400' },
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('hero-stats');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;
        if (isInView) {
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    // Check immediately in case component is already in view
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-casino-neon-green/10 rounded-full blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-casino-neon-purple/10 rounded-full blur-3xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Trusted
            <motion.span 
              className="gradient-text block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Casino Guide
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Find the best online casinos, Live Reports, read honest reviews, 
            and discover safe gambling platforms recommended by experts.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg" 
                onClick={scrollToCasinos}
                className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-8 py-3 text-lg neon-border"
              >
                Find Best Casinos
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-casino-neon-green/50 text-casino-neon-green hover:bg-casino-neon-green/10 font-semibold px-8 py-3 text-lg"
              >
                Read Reviews
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div id="hero-stats" className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
            className="contents"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={item} className="h-full">
                <motion.div
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-full"
                >
                  <Card className="bg-casino-card-bg border-casino-border-subtle p-6 text-center card-hover h-full">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                    >
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    </motion.div>
                    <div className="text-3xl font-bold mb-2 text-white">
                      <CountUp
                        end={parseFloat(stat.value.replace(/[,+]/g, ''))}
                        duration={1.5}
                        separator=","
                        decimals={stat.value.includes('.') ? 1 : 0}
                      />
                      {stat.value.match(/[+%]$/) ? stat.value.match(/[+%]$/)[0] : ''}
                    </div>
                    <motion.div 
                      className="text-gray-400 text-sm"
                      initial={{ opacity: 0 }}
                      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    >
                      {stat.label}
                    </motion.div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
