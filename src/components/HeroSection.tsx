import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { motion } from 'framer-motion';
import { useIsDesktop } from '@/src/hooks/useIsDesktop';
import { Shield, Users, Gift, Award } from 'lucide-react';
import CountUp from 'react-countup';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ClientOnly from './ClientOnly';

const FaqSection = dynamic(() => import('@/src/components/FaqSection'), { ssr: false });

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
      <section className="relative text-center py-4 sm:py-8 lg:py-12 xl:py-16 bg-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url("${backgroundPattern}")` }}
          ></div>
        </div>

        {/* Proper responsive: Mobile COMPACT, Desktop NORMAL/BIG */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={isDesktop ? { opacity: 0, y: 30 } : false}
            animate={isDesktop ? { opacity: 1, y: 0 } : false}
            transition={isDesktop ? { duration: 1, ease: 'easeOut' } : {}}
            className="w-full"
          >
            <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white leading-tight mb-2 sm:mb-4 lg:mb-6">
              Your Trusted
              <br />
              <span className="bg-gradient-to-r from-casino-neon-green via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Casino Guide
              </span>
            </h1>
            <p className="mt-2 sm:mt-4 lg:mt-6 text-xs sm:text-base lg:text-lg xl:text-xl text-gray-300 w-full leading-relaxed">
              Discover first-class online casinos with expert reviews, trusted reports, and safe gambling platforms recommended by CGSG professionals.
            </p>
          </motion.div>

          <motion.div
            initial={isDesktop ? { opacity: 0, y: 20 } : false}
            animate={isDesktop ? { opacity: 1, y: 0 } : false}
            transition={isDesktop ? { duration: 0.8, delay: 0.3, ease: 'easeOut' } : {}}
            className="mt-3 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center items-center w-full"
          >
            <Button
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-casino-neon-green to-emerald-400 hover:from-emerald-400 hover:to-casino-neon-green text-casino-dark font-semibold px-3 sm:px-4 lg:px-6 xl:px-8 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 text-xs sm:text-sm lg:text-base xl:text-lg rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-casino-neon-green/25 group"
              onClick={() => {
                const section = document.getElementById('top-casinos');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                <span className="hidden xs:inline">Find Best Casinos</span>
                <span className="xs:hidden">Best Casinos</span>
                <svg className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
            <Link href="/reviews" className="w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-2 border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark px-3 sm:px-4 lg:px-6 xl:px-8 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 text-xs sm:text-sm lg:text-base xl:text-lg rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm group"
              >
                <span className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  <span className="hidden xs:inline">Read Reviews</span>
                  <span className="xs:hidden">Reviews</span>
                  <svg className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </Button>
            </Link>
          </motion.div>

        {/* Stats Grid - Responsive: Mobile COMPACT, Desktop NORMAL */}
        <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.4, ease: 'easeOut' } : {}}
          className="mt-4 sm:mt-8 lg:mt-10 xl:mt-12 w-full"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/60 border border-casino-neon-green/20 rounded-lg sm:rounded-xl p-2 sm:p-4 lg:p-5 xl:p-6 text-center transition-all duration-300 hover:border-casino-neon-green/40 hover:shadow-lg hover:shadow-casino-neon-green/10 backdrop-blur-sm"
                whileHover={{ scale: isDesktop ? 1.03 : 1 }}
                initial={isDesktop ? { opacity: 0, y: 20 } : false}
                animate={isDesktop ? { opacity: 1, y: 0 } : false}
                transition={isDesktop ? { duration: 0.6, delay: 0.6 + index * 0.1 } : {}}
              >
                <div className="mb-1 sm:mb-2 lg:mb-3 flex justify-center">
                  <div className="p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl bg-casino-neon-green/10 border border-casino-neon-green/20">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-sm sm:text-xl lg:text-2xl xl:text-3xl font-black text-casino-neon-green mb-0.5 sm:mb-1 lg:mb-2">
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
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CGSG Logo + Caption - Responsive: Mobile COMPACT, Desktop NORMAL */}
        <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.5, ease: 'easeOut' } : {}}
          className="mt-4 sm:mt-8 lg:mt-10 xl:mt-12 flex flex-col items-center justify-center gap-1 sm:gap-2 lg:gap-3"
        >
          <div className="relative w-20 sm:w-32 lg:w-40 xl:w-48 h-20 sm:h-32 lg:h-40 xl:h-48">
            <Image src="/favicon.ico" alt="CGSG Logo" fill priority className="object-contain" />
          </div>
          <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-300 text-center px-1 sm:px-2">
            As an independent platform, CGSG delivers transparent, data-driven reviews and analytics to help you play smarter and safer.
          </p>
        </motion.div>

         {/* Fair Gaming Logo + Caption - Responsive: Mobile COMPACT, Desktop NORMAL */}
         <motion.div
          initial={isDesktop ? { opacity: 0, y: 20 } : false}
          animate={isDesktop ? { opacity: 1, y: 0 } : false}
          transition={isDesktop ? { duration: 0.8, delay: 0.6, ease: 'easeOut' } : {}}
          className="mt-4 sm:mt-8 lg:mt-10 xl:mt-12 flex flex-col items-center justify-center gap-1 sm:gap-2 lg:gap-3"
        >
          <div className="relative w-20 sm:w-32 lg:w-40 xl:w-48 h-20 sm:h-32 lg:h-40 xl:h-48">
            <Image src="/fair-logos.png" alt="Fair Gaming License" fill priority className="object-contain" />
          </div>
          <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-300 text-center px-1 sm:px-2">
           CGSG license ensures the integrity and legacy of trusted company transaction records.
          </p>
        </motion.div>

          {/* About Us teaser - Responsive: Mobile COMPACT, Desktop NORMAL */}
          <motion.div
            initial={isDesktop ? { opacity: 0, y: 20 } : false}
            animate={isDesktop ? { opacity: 1, y: 0 } : false}
            transition={isDesktop ? { duration: 0.8, delay: 0.6, ease: 'easeOut' } : {}}
            className="mt-4 sm:mt-8 lg:mt-10 xl:mt-12 w-full"
          >
            <Link href="/about-us" className="block group" prefetch>
              <div className="rounded-lg sm:rounded-xl border border-gray-700/60 bg-gray-800/60 hover:border-casino-neon-green/60 transition-colors p-3 sm:p-4 lg:p-5 xl:p-6">
                <h3 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-semibold text-white mb-1 sm:mb-2 lg:mb-3 group-hover:text-casino-neon-green transition-colors">
                  Learn more about CGSG
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base xl:text-lg">
                  Discover our mission, team, and how we ensure a transparent & safe gambling environment for players worldwide.
                </p>
                <span className="inline-block mt-2 sm:mt-3 lg:mt-4 text-casino-neon-green font-medium group-hover:underline text-xs sm:text-sm lg:text-base xl:text-lg">
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
