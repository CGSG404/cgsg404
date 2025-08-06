'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import { cn } from '@/src/lib/utils';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  cta: string;
  ctaLink: string;
  img: string;
}

// Optimized banners with smaller, compressed images
const banners: Banner[] = [
  {
    id: 1,
    img: '/news-banner/domain.png',
    title: 'Welcome to CGSG!',
    subtitle: 'Your Trusted Casino Guide Singapore',
    highlight: 'DISCOVER THE BEST CASINOS! 🎰',
    cta: 'Get Started',
    ctaLink: '/casinos-singapore',
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

interface OptimizedHeroBannerProps {
  isHomePage?: boolean;
}

export default function OptimizedHeroBanner({ isHomePage = false }: OptimizedHeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Mark as loaded after mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentBanner = banners[currentSlide];

  return (
    <section 
      className={cn(
        "relative w-full overflow-hidden",
        isHomePage ? "h-screen" : "h-[60vh] md:h-[70vh]"
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={currentBanner.img}
          alt={currentBanner.title}
          fill
          priority
          quality={85}
          objectFit="cover"
          className="transition-opacity duration-1000"
          sizes="100vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Highlight Badge */}
            <div 
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-full bg-casino-neon-green/20 border border-casino-neon-green/30 mb-6 transition-all duration-700",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <span className="text-casino-neon-green font-medium text-sm lg:text-base">
                {currentBanner.highlight}
              </span>
            </div>

            {/* Main Title */}
            <h1 
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight transition-all duration-700 delay-100",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {currentBanner.title}
            </h1>

            {/* Subtitle */}
            <p 
              className={cn(
                "text-lg md:text-xl lg:text-2xl text-casino-text-secondary mb-8 max-w-2xl transition-all duration-700 delay-200",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {currentBanner.subtitle}
            </p>

            {/* CTA Buttons */}
            <div 
              className={cn(
                "flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Link
                href={currentBanner.ctaLink}
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-casino-neon-green text-casino-dark font-semibold text-lg hover:bg-casino-neon-green-light transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-casino-neon-green/25"
              >
                {currentBanner.cta}
              </Link>
              
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                Read Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-casino-neon-green scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator (only on homepage) */}
      {isHomePage && (
        <div className="absolute bottom-8 right-8 z-20">
          <div className="flex flex-col items-center text-white/70 animate-bounce">
            <span className="text-sm mb-2">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Performance-optimized background preloader */}
      <div className="sr-only">
        {banners.slice(1).map((banner) => (
          <OptimizedImage
            key={banner.id}
            src={banner.img}
            alt=""
            width={1}
            height={1}
            priority={false}
            quality={50}
          />
        ))}
      </div>
    </section>
  );
}