import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { Shield, Users, Gift, Award } from 'lucide-react';
import CountUp from 'react-countup';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const FaqSection = dynamic(() => import('@/components/FaqSection'), { ssr: false });

const stats = [
  { icon: <Shield className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '87+', label: 'Casinos Reviewed' },
  { icon: <Users className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '1081+', label: 'Forum Activities' },
  { icon: <Gift className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '800+', label: 'Bonus Offers' },
  { icon: <Award className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '99%', label: 'Trust Score' }
];

const HeroSection: React.FC = () => {
  const isDesktop = useIsDesktop();
  return (
    <>
      <section className="relative text-center pt-20 pb-10 md:pt-32 md:pb-16">
      
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, ease: 'easeOut' } : {}}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Your Trusted
            <br />
            <span className="text-casino-neon-green">Casino Guide</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white max-w-3xl mx-auto">
          Discover first-class online casinos. Read expert reviews, explore trusted reports, and find safe gambling platforms recommended by CGSG.
          </p>
        </motion.div>

        <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.2, ease: 'easeOut' } : {}}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto bg-casino-neon-green text-casino-dark font-bold hover:bg-casino-neon-green/90 transition-colors px-8 py-6 text-base"
            onClick={() => {
              const section = document.getElementById('top-casinos');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Find Best Casinos
          </Button>
          <Link href="/reviews">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-6 text-base"
            >
              Read Reviews
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.4, ease: 'easeOut' } : {}}
          className="mt-12 md:mt-16 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-center transition-all duration-300 hover:border-casino-neon-green/50 hover:shadow-lg hover:shadow-casino-neon-green/10"
                whileHover={{ scale: isDesktop ? 1.05 : 1 }}
              >
                {stat.icon}
                <p className="text-2xl font-bold text-white">
                  {stat.value.includes('+') ? (
                    <CountUp
                      end={parseInt(stat.value)} 
                      duration={2.5}
                      suffix="+"
                      className="inline-block"
                    />
                  ) : stat.value.includes('%') ? (
                    <CountUp
                      end={parseInt(stat.value)}
                      duration={2.5}
                      suffix="%"
                      className="inline-block"
                    />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CGSG Logo + Caption */}
        <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.5, ease: 'easeOut' } : {}}
          className="mt-12 flex flex-col items-center justify-center gap-3"
        >
          <div className="relative w-40 h-40 md:w-56 md:h-56">
            <Image src="/favicon.ico" alt="CGSG Logo" fill priority className="object-contain" />
          </div>
          <p className="text-base md:text-lg text-gray-300 max-w-xl text-center px-2">
            As an independent platform, CGSG delivers transparent, data-driven reviews and analytics to help you play smarter and safer.
          </p>
        </motion.div>

         {/* CGSG Logo + Caption */}
         <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.5, ease: 'easeOut' } : {}}
          className="mt-12 flex flex-col items-center justify-center gap-3"
        >
          <div className="relative w-40 h-40 md:w-56 md:h-56">
            <Image src="/fair-logos.png" alt="CGSG Logo" fill priority className="object-contain" />
          </div>
          <p className="text-base md:text-lg text-gray-300 max-w-xl text-center px-2">
           CGSG license, We issue to every trusted company ensures the integrity and legacy of their transaction records.
          </p>
        </motion.div>

          {/* About Us teaser */}
          <motion.div
            initial={isDesktop ? { opacity: 0, y: 20 } : false}
            animate={isDesktop ? { opacity: 1, y: 0 } : false}
            transition={isDesktop ? { duration: 0.8, delay: 0.6, ease: 'easeOut' } : {}}
            className="mt-14 max-w-4xl mx-auto"
          >
            <Link href="/about-us" className="block group" prefetch>
              <div className="rounded-xl border border-gray-700/60 bg-gray-800/60 hover:border-casino-neon-green/60 transition-colors p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-casino-neon-green transition-colors">
                  Learn more about CGSG
                </h3>
                <p className="text-gray-300 text-sm md:text-base">
                  Discover our mission, team, and how we ensure a transparent & safe gambling environment for players worldwide.
                </p>
                <span className="inline-block mt-4 text-casino-neon-green font-medium group-hover:underline">
                  Read About Us &rarr;
                </span>
              </div>
            </Link>
          </motion.div>

      </div>
    </section>
            <FaqSection />
    </>
  );
};

export default HeroSection;
