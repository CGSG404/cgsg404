'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import '@/src/styles/parallax.css';
import ClientOnly from './ClientOnly';

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
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <div className={`relative w-full ${isHomePage ? 'h-screen min-h-screen' : 'h-[400px] md:h-[550px] lg:h-[650px]'}`}>
              {/* Fallback Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-casino-dark via-casino-darker to-purple-900 z-[1]" />

              {/* Background Image */}
              <div className="absolute inset-0 z-[2]">
                <Image
                  src={banner.img}
                  alt="Casino Banner Background"
                  fill
                  priority={idx === 0}
                  quality={95}
                  sizes="100vw"
                  className="object-cover object-center"
                  onError={(e) => {
                    // Hide image if it fails to load, fallback background will show
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Dark Overlay - Reduced for better image visibility */}
              <div className="absolute inset-0 bg-black/30 z-[3]" />

              {/* Banner Content - REMOVED for clean fullscreen banner */}

            </div>
          </SwiperSlide>
        ))}
        </Swiper>
      </ClientOnly>

      {/* Navigation removed for clean fullscreen banner */}
    </div>
  );
}