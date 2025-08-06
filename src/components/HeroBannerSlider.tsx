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
      <div className={`w-full ${isHomePage ? 'h-screen min-h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'} bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center relative overflow-hidden`}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-casino-dark via-casino-darker to-purple-900 animate-pulse"></div>
        
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
      className={`${isHomePage ? 'parallax-banner' : 'relative w-full'} hero-banner-slider overflow-hidden group ${!isHomePage ? 'h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]' : ''}`}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{
          delay: 6000, // Reduced for better engagement
          disableOnInteraction: false,
          pauseOnMouseEnter: true // Better UX
        }}
        loop
        className="w-full h-full"
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        speed={1200} // Faster transition for better performance
        allowTouchMove={false}
        watchSlidesProgress={true}
        watchOverflow={true}
        preloadImages={false} // Better performance
        lazy={true} // Enable lazy loading
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={`${banner.id}-${idx}`}>
            <div className={`relative w-full ${isHomePage ? 'h-screen min-h-[100dvh] max-h-screen' : 'h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]'}`}>
              {/* Fallback Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-casino-dark via-casino-darker to-purple-900 z-[1]" />

              {/* Background Image - Optimized for responsive performance */}
              <div className="absolute inset-0 z-[2]">
                <Image
                  src={banner.img}
                  alt={`${banner.title} - Casino Banner`}
                  fill
                  priority={idx === 0}
                  quality={idx === 0 ? 90 : 80} // First image higher quality
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  className="object-cover object-center transition-transform duration-500 ease-out"
                  loading={idx === 0 ? "eager" : "lazy"} // First image loads immediately
                  onError={(e) => {
                    // Hide image if it fails to load, fallback background will show
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    // Reduced zoom for better performance
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                />
              </div>

              {/* Dark Overlay - Reduced for better image visibility */}
              <div className="absolute inset-0 bg-black/20 z-[3]" />

              {/* Content Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[4]" />

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

              {/* Scroll Indicator - Only show on homepage, responsive positioning */}
              {isHomePage && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-[15] flex items-center justify-center">
                  <div 
                    className="flex flex-col items-center cursor-pointer group animate-bounce hover:animate-none transition-all duration-300"
                    onClick={() => {
                      // Use dynamic viewport height for better responsiveness
                      const scrollTarget = window.innerHeight || document.documentElement.clientHeight;
                      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                    }}
                  >
                    {/* Responsive scroll indicator circle */}
                    <div className="relative w-6 h-10 sm:w-8 sm:h-12 border-2 border-white/70 rounded-full flex justify-center group-hover:border-white transition-all duration-300 bg-black/20 backdrop-blur-sm">
                      {/* Responsive scroll dot */}
                      <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-1.5 sm:mt-2 animate-pulse group-hover:bg-white group-hover:animate-none transition-all duration-300"></div>
                    </div>
                    
                    {/* Responsive text below */}
                    <span className="text-white/70 text-xs font-light mt-1 sm:mt-2 group-hover:text-white transition-all duration-300 tracking-wide hidden sm:block">
                      SCROLL
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