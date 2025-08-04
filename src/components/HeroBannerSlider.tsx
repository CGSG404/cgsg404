'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import '@/src/styles/parallax.css';
import ClientOnly from './ClientOnly';
import Link from 'next/link';
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
      <div className={`w-full ${isHomePage ? 'h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'} bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center`}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-lg">Loading banner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isHomePage ? 'parallax-banner' : 'relative w-full'} hero-banner-slider overflow-hidden group ${!isHomePage ? 'h-[400px] md:h-[550px] lg:h-[650px]' : ''}`}>
      <ClientOnly fallback={
        <div className={`w-full ${isHomePage ? 'h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'} bg-gradient-to-br from-casino-dark via-casino-darker to-casino-dark flex items-center justify-center`}>
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
            <div className={`relative w-full ${isHomePage ? 'h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'}`}>
              {/* Fallback Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-casino-dark via-casino-darker to-purple-900 z-0" />
              
              {/* Background Image */}
              <div className="absolute inset-0 z-5">
                <Image
                  src={banner.img}
                  alt={banner.title}
                  fill
                  priority={idx === 0}
                  quality={90}
                  sizes="100vw"
                  className="object-cover scale-105 transition-transform ease-out"
                  style={{ transitionDuration: '8000ms' }}
                  onError={(e) => {
                    // Hide image if it fails to load, fallback background will show
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50 z-10" />

              {/* Banner Content */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  {/* Highlight Text */}
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-casino-neon-green to-emerald-400 text-casino-dark px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
                      {banner.highlight}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-casino-neon-green to-white bg-clip-text text-transparent">
                      {banner.title}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 font-light leading-relaxed">
                    {banner.subtitle}
                  </p>

                  {/* CTA Button */}
                  <Link href={banner.ctaLink}>
                    <button className="bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      {banner.cta}
                    </button>
                  </Link>
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