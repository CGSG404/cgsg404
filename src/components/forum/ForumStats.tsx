import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle, TrendingUp, Clock } from 'lucide-react';

const AnimatedNumber = ({ value }: { value: string }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const targetValue = parseInt(value.replace(/,/g, ''));
  const duration = 2; // durasi animasi dalam detik

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / (duration * 1000));
      
      // Ease out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.floor(easeOut * targetValue);
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timer);
  }, [targetValue]);

  // Format angka dengan koma
  const formattedValue = currentValue.toLocaleString('en-US');

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {currentValue.toLocaleString('en-US')}
    </motion.span>
  );
};

const ForumStats = () => {
  const [isInView, setIsInView] = useState(false);
  
  const forumStats = [
    { label: "Total Members", value: "1,081", icon: Users },
    { label: "Total Topics", value: "3,218", icon: MessageCircle },
    { label: "Total Posts", value: "2,180", icon: TrendingUp },
    { label: "Online Now", value: "287", icon: Clock }
  ];
  
  // Efek untuk memicu animasi saat komponen masuk viewport
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('forum-stats');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom >= 0;
        if (isVisible) {
          setIsInView(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };
    
    // Cek langsung jika komponen sudah terlihat
    handleScroll();
    
    // Tambahkan event listener scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="forum-stats" className="py-12 bg-casino-card-bg/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2
              }
            }
          }}
        >
          {forumStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }
              }}
            >
              <Card className="bg-casino-card-bg border-casino-border-subtle text-center hover:shadow-lg hover:shadow-casino-neon-green/10 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="pt-6">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 100 }}
                  >
                    <stat.icon className="w-8 h-8 text-casino-neon-green mx-auto mb-2" />
                  </motion.div>
                  <div className="text-2xl font-bold text-white mb-1 min-h-[36px] flex items-center justify-center">
                    {isInView ? <AnimatedNumber value={stat.value} /> : '0'}
                  </div>
                  <motion.div 
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {stat.label}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ForumStats;
