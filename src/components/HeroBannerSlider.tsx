'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import '@/src/styles/parallax.css';
import Image from 'next/image';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  cta: string;
  ctaLink: string;
  img: string;
}

interface HeroBannerSliderProps {
  pageType?: string;
  isHomePage?: boolean;
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

export default function HeroBannerSlider({ pageType = 'home', isHomePage = false }: HeroBannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Single useEffect untuk mounting dan data fetching
  useEffect(() => {
    setIsMounted(true);
    
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

  // Show loading state only if not mounted or still loading
  if (!isMounted || loading) {
    return (
      <div className={`w-full ${isHomePage ? 'h-screen min-h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'} bg-black flex items-center justify-center relative overflow-hidden`}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-black animate-pulse"></div>
        
        {/* Loading content */}
        <div className="text-center text-white relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading banner...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      data-banner="true"
      className={`${isHomePage ? 'parallax-banner' : 'relative w-full'} hero-banner-slider overflow-hidden group ${!isHomePage ? 'h-[400px] md:h-[550px] lg:h-[650px]' : ''}`}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        loop
        className="w-full h-full"
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        speed={1500}
        allowTouchMove={false}
        watchSlidesProgress={true}
        watchOverflow={true}
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={`${banner.id}-${idx}`}>
            <div className={`relative w-full ${isHomePage ? 'h-screen min-h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'}`}>
              {/* Fallback Background */}
              <div className="absolute inset-0 bg-black z-[1]" />

              {/* Background Image */}
              <div className="absolute inset-0 z-[2]">
                <Image
                  src={banner.img}
                  alt={`${banner.title} - Casino Banner`}
                  fill
                  priority={idx === 0}
                  quality={95}
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out"
                  onError={(e) => {
                    // Hide image if it fails to load, fallback background will show
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    // Add subtle zoom effect on load
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                />
              </div>

              {/* Dark Overlay - Reduced for better image visibility */}
              <div className="absolute inset-0 bg-black/20 z-[3]" />

              {/* Content Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30 z-[4]" />

              {/* Banner Content - Optional for fullscreen mode */}
              {!isHomePage && (
                <div className="absolute inset-0 z-[4] flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {banner.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-6 text-gray-200 animate-fade-in-up">
                      {banner.subtitle}
                    </p>
                    <div className="mb-8">
                      <span className="inline-block bg-casino-neon-green text-casino-dark px-6 py-3 rounded-full font-bold text-lg animate-pulse-glow">
                        {banner.highlight}
                      </span>
                    </div>
                    <a
                      href={banner.ctaLink}
                      className="inline-block bg-casino-neon-green text-casino-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-casino-neon-green-dark hover:shadow-lg hover:shadow-casino-neon-green/25 transition-all duration-300 animate-fade-in-up"
                    >
                      {banner.cta}
                    </a>
                  </div>
                </div>
              )}

              {/* Professional Minimal Scroll Indicator - Only show on homepage */}
              {isHomePage && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[15] flex items-center justify-center">
                  <div 
                    className="flex flex-col items-center cursor-pointer group transition-all duration-500 ease-out hover:scale-110"
                    onClick={() => {
                      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    }}
                  >
                    {/* Compact animated scroll indicator */}
                    <div className="relative">
                      {/* Animated pulse ring */}
                      <div className="absolute inset-0 w-8 h-8 rounded-full border border-white/20 animate-ping opacity-75"></div>
                      
                      {/* Main circle - smaller and more compact */}
                      <div className="relative w-8 h-8 rounded-full border border-white/25 flex items-center justify-center backdrop-blur-md bg-white/10 group-hover:border-casino-neon-green/60 group-hover:bg-casino-neon-green/20 transition-all duration-500 shadow-lg group-hover:shadow-casino-neon-green/25">
                        {/* Animated chevron down */}
                        <svg 
                          className="w-3 h-3 text-white/60 group-hover:text-casino-neon-green transition-all duration-500 transform group-hover:translate-y-0.5 animate-bounce" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Compact text with fade animation */}
                    <span className="text-white/40 text-xs font-light mt-3 group-hover:text-casino-neon-green transition-all duration-500 tracking-wider uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                      Scroll
                    </span>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}