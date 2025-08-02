'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Banner {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  highlight: string;
  cta: string;
  ctaLink: string;
}

interface HeroBannerSliderProps {
  pageType?: string;
}

// Default fallback banners
const defaultBanners = [
  {
    id: 1,
    img: '/news-banner/domain.png',
    title: 'Welcome to CGSG!',
    subtitle: 'Your Trusted Casino Guide Singapore',
    highlight: 'DISCOVER THE BEST CASINOS! 🎰',
    cta: 'Get Started',
    ctaLink: '/casinos',

  },
  {
    id: 2,
    img: '/news-banner/domain1.png',
    title: 'Exclusive Bonuses',
    subtitle: 'Up to 200% Welcome Bonus + Free Spins',
    highlight: 'CLAIM YOUR BONUS NOW! 🎁',
    cta: 'View Bonuses',
    ctaLink: '/best-bonuses',

  },
  {
    id: 3,
    img: '/success-stories-cgsg.png',
    title: 'Success Stories',
    subtitle: 'Join Our Winning Community',
    highlight: 'BE THE NEXT WINNER! 🏆',
    cta: 'Read Stories',
    ctaLink: '/success-stories',

  },
];

export default function HeroBannerSliderSimple({ pageType = 'home' }: HeroBannerSliderProps) {
  const pathname = usePathname();
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Check if this is a non-homepage that needs navbar compensation
  const isHomePage = pathname === '/';
  const needsNavbarCompensation = !isHomePage;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/admin/banners?page_type=${pageType}`);
        const data = await response.json();
        
        if (data.banners && data.banners.length > 0) {
          // Transform API data to component format
          const transformedBanners = data.banners.map((banner: {
            id: number;
            title: string;
            subtitle: string;
            highlight: string;
            cta_text: string;
            cta_link: string;
            image_url: string;
            gradient_class: string;
          }) => ({
            id: banner.id,
            img: banner.image_url || '/news-banner/domain.png',
            title: banner.title,
            subtitle: banner.subtitle,
            highlight: banner.highlight,
            cta: banner.cta_text,
            ctaLink: banner.cta_link
          }));
          setBanners(transformedBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Keep default banners on error
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [pageType]);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Handle touch and mouse interactions
  const handleInteractionStart = () => {
    setShowControls(true);
  };

  const handleInteractionEnd = () => {
    // Delay hiding controls to allow for interaction
    setTimeout(() => setShowControls(false), 2000);
  };

  if (loading) {
    return (
      <div
        className={`w-full bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center ${
          needsNavbarCompensation
            ? 'h-[480px] md:h-[630px] lg:h-[730px] top-banner-fullscreen'
            : 'h-[400px] md:h-[550px] lg:h-[650px]'
        }`}
        style={needsNavbarCompensation ? {
          marginTop: '-64px',
          paddingTop: '64px'
        } : {}}
      >
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-lg">Loading banner...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full hero-banner-slider overflow-hidden group ${
        needsNavbarCompensation ? 'top-banner-fullscreen' : ''
      }`}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      style={needsNavbarCompensation ? {
        marginTop: '-64px',
        paddingTop: '64px'
      } : {}}
    >
      <div className={`relative w-full ${
        needsNavbarCompensation
          ? 'h-[480px] md:h-[630px] lg:h-[730px]'
          : 'h-[400px] md:h-[550px] lg:h-[650px]'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${banners[currentSlide]?.img})`,
              }}
            />

            {/* Simple Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="max-w-3xl">
                  {/* Animated Title */}
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight"
                  >
                    {banners[currentSlide]?.title}
                  </motion.h1>

                  {/* Animated Subtitle */}
                  <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-4 sm:mb-6 leading-relaxed"
                  >
                    {banners[currentSlide]?.subtitle}
                  </motion.p>
                  
                  {/* Animated Highlight */}
                  {banners[currentSlide]?.highlight && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mb-4 sm:mb-6 lg:mb-8"
                    >
                      <span className="inline-block bg-casino-neon-green text-casino-dark px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl animate-pulse">
                        {banners[currentSlide]?.highlight}
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Animated CTA Button */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link
                      href={banners[currentSlide]?.ctaLink || '/'}
                      className="inline-flex items-center px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-casino-neon-green text-casino-dark font-semibold text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl lg:rounded-full hover:bg-casino-neon-green/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-casino-neon-green/25"
                    >
                      <span className="whitespace-nowrap">{banners[currentSlide]?.cta}</span>
                      <svg className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20
                         bg-casino-dark/80 hover:bg-casino-dark/90
                         border border-casino-neon-green/60 hover:border-casino-neon-green
                         text-casino-neon-green p-2 md:p-3 rounded-full
                         transition-all duration-300 backdrop-blur-sm
                         hover:scale-105 hover:shadow-lg
                         w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                         ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20
                         bg-casino-dark/80 hover:bg-casino-dark/90
                         border border-casino-neon-green/60 hover:border-casino-neon-green
                         text-casino-neon-green p-2 md:p-3 rounded-full
                         transition-all duration-300 backdrop-blur-sm
                         hover:scale-105 hover:shadow-lg
                         w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                         ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-casino-neon-green' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
