'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import ClientOnly from './ClientOnly';
import Link from 'next/link';

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

export default function HeroBannerSlider({ pageType = 'home' }: HeroBannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="w-full h-[400px] md:h-[550px] lg:h-[650px] bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-lg">Loading banner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full hero-banner-slider overflow-hidden group">
      <ClientOnly fallback={
        <div className="w-full h-[400px] md:h-[550px] lg:h-[650px] bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
            <p className="text-lg">Loading banner...</p>
          </div>
        </div>
      }>
        <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: '.custom-prev',
          nextEl: '.custom-next',
        }}
        className="w-full"
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        speed={1000}
        grabCursor={true}
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[400px] md:h-[550px] lg:h-[650px]">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={banner.img}
                  alt={banner.title}
                  className="object-cover w-full h-full scale-105 transition-transform ease-out"
                  style={{ transitionDuration: '8000ms' }}
                />
              </div>

              {/* Simple Dark Overlay */}
              <div className="absolute inset-0 bg-black/60 z-10" />
              <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 bg-gradient-to-t from-[#0e181c] via-[#0e181c]/80 to-transparent z-20" />

              {/* Content Container */}
              <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4 md:px-8 banner-content">
                <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
                  {/* Main Title */}
                  <h1 className="banner-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white mb-2 drop-shadow-2xl leading-tight tracking-tight text-shadow-strong">
                    {banner.title}
                  </h1>

                  {/* Subtitle */}
                  <div className="banner-subtitle text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white/95 mb-3 drop-shadow-xl leading-tight text-shadow-strong">
                    {banner.subtitle}
                  </div>

                  {/* Highlight Text */}
                  <div className="banner-highlight text-casino-neon-green text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-extrabold mb-4 sm:mb-6 lg:mb-8 drop-shadow-lg">
                    {banner.highlight}
                  </div>

                  {/* CTA Button */}
                  <div className="banner-cta">
                    <a href={banner.ctaLink} className="inline-block group">
                      <button className="bg-casino-neon-green hover:bg-emerald-400 text-casino-dark text-sm sm:text-base md:text-lg lg:text-xl font-semibold px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-12 lg:py-5 rounded-lg sm:rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white/20">
                        <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                          <span className="whitespace-nowrap">{banner.cta}</span>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </button>
                    </a>
                  </div>
                </div>
              </div>


            </div>
          </SwiperSlide>
        ))}
        </Swiper>
      </ClientOnly>

      {/* Custom Navigation Buttons */}
      <button
        className="custom-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-30
                   bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3
                   transition-all duration-300 opacity-0 group-hover:opacity-100
                   border border-white/20 hover:border-white/40"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="custom-next absolute right-4 top-1/2 transform -translate-y-1/2 z-30
                   bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3
                   transition-all duration-300 opacity-0 group-hover:opacity-100
                   border border-white/20 hover:border-white/40"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}