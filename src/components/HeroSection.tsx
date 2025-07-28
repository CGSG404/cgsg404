import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { motion } from 'framer-motion';
import { useIsDesktop } from '@/src/hooks/useIsDesktop';
import { Shield, Users, Gift, Award } from 'lucide-react';
import CountUp from 'react-countup';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ClientOnly from './ClientOnly';

const FaqSection = dynamic(() => import('@/components/FaqSection'), { ssr: false });

const stats = [
  { icon: <Shield className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '87+', label: 'Casinos Reviewed' },
  { icon: <Users className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '1081+', label: 'Forum Activities' },
  { icon: <Gift className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '800+', label: 'Bonus Offers' },
  { icon: <Award className="w-8 h-8 mx-auto text-casino-neon-green mb-2" />, value: '99%', label: 'Trust Score' }
];

const HeroSection: React.FC = () => {
  const isDesktop = useIsDesktop();
  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff9a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <>
      <section className="relative text-center pt-16 pb-12 md:pt-24 md:pb-20 bg-gradient-to-b from-casino-dark via-casino-darker to-casino-dark">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url("${backgroundPattern}")` }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={isDesktop ? { opacity: 0, y: 30 } : false}
            animate={isDesktop ? { opacity: 1, y: 0 } : false}
            transition={isDesktop ? { duration: 1, ease: 'easeOut' } : {}}
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Your Trusted
              <br />
              <span className="bg-gradient-to-r from-casino-neon-green via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Casino Guide
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover first-class online casinos with expert reviews, trusted reports, and safe gambling platforms recommended by CGSG professionals.
            </p>
          </motion.div>

          <motion.div
            initial={isDesktop ? { opacity: 0, y: 20 } : false}
            animate={isDesktop ? { opacity: 1, y: 0 } : false}
            transition={isDesktop ? { duration: 0.8, delay: 0.3, ease: 'easeOut' } : {}}
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-casino-neon-green to-emerald-400 hover:from-emerald-400 hover:to-casino-neon-green text-casino-dark font-bold px-10 py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-casino-neon-green/25 group"
              onClick={() => {
                const section = document.getElementById('top-casinos');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="flex items-center gap-2">
                Find Best Casinos
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
            <Link href="/reviews" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark px-10 py-4 text-lg rounded-xl font-bold transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm group"
              >
                <span className="flex items-center gap-2">
                  Read Reviews
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
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
                className="bg-gradient-to-br from-casino-card-bg/60 to-casino-darker/60 border border-casino-neon-green/20 rounded-xl p-6 text-center transition-all duration-300 hover:border-casino-neon-green/40 hover:shadow-lg hover:shadow-casino-neon-green/10 backdrop-blur-sm"
                whileHover={{ scale: isDesktop ? 1.05 : 1 }}
                initial={isDesktop ? { opacity: 0, y: 20 } : false}
                animate={isDesktop ? { opacity: 1, y: 0 } : false}
                transition={isDesktop ? { duration: 0.6, delay: 0.6 + index * 0.1 } : {}}
              >
                <div className="mb-3 flex justify-center">
                  <div className="p-3 rounded-xl bg-casino-neon-green/10 border border-casino-neon-green/20">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-black text-casino-neon-green mb-2">
                  <ClientOnly fallback={<span>{stat.value}</span>}>
                    {stat.value.includes('+') ? (
                      <CountUp
                        end={parseInt(stat.value)}
                        duration={2.5}
                        suffix="+"
                        className="inline-block"
                        delay={0.8 + index * 0.2}
                      />
                    ) : stat.value.includes('%') ? (
                      <CountUp
                        end={parseInt(stat.value)}
                        duration={2.5}
                        suffix="%"
                        className="inline-block"
                        delay={0.8 + index * 0.2}
                      />
                    ) : (
                      stat.value
                    )}
                  </ClientOnly>
                </p>
                <p className="text-sm md:text-base text-gray-300 font-medium">{stat.label}</p>
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
