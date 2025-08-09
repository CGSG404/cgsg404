/**
 * @component HeroSlider
 * @description Komponen React yang menampilkan kumpulan card casino dalam slider horizontal.
 * - Menggunakan SwiperJS untuk fungsionalitas slider otomatis (auto-slide).
 * - Setiap card berisi nama kasino, rating, bonus, dan safety index.
 * - Card memiliki background gelap, sudut membulat, dan tombol "Get Bonus".
 * - Mendukung gestur swipe di perangkat mobile dan auto-slide setiap 3 detik.
 * - Dibuat responsif menggunakan Tailwind CSS.
 */
'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Shield, Gift, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHeroSliderCasinos, fallbackHeroSliderData } from '@/src/lib/homepage-data';
import { Button } from '@/src/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Fallback data will be imported from homepage-data.ts

const HeroSlider: React.FC = () => {
  const { data: casinos = fallbackHeroSliderData } = useQuery({
    queryKey: ['heroSliderCasinos'],
    queryFn: fetchHeroSliderCasinos,
    initialData: fallbackHeroSliderData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return (
    <div id="top-casinos" className="relative w-full container mx-auto py-8 md:py-12 safe-area-all">
      <div className="absolute inset-0 bg-neon-gradient opacity-10 -z-10"></div>
      <div className="relative z-10">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Top Casinos</h2>
          <p className="text-sm md:text-lg text-gray-400 mt-2">Find the best deals from the most trusted casinos.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          effect="slide"
          spaceBetween={8}
          slidesPerView={2.2}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            480: {
              slidesPerView: 2.2,
              spaceBetween: 8,
              centeredSlides: true,
            },
            640: {
              slidesPerView: 2.4,
              spaceBetween: 12,
              centeredSlides: true,
            },
            768: {
              slidesPerView: 2.6,
              spaceBetween: 16,
              centeredSlides: true,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
              centeredSlides: true,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 24,
              centeredSlides: true,
            },
          }}
          className="hero-casino-slider"
        >
          {casinos.map((casino) => (
            <SwiperSlide key={casino.id} className="py-2 md:py-6">
              <div className="group relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/30 rounded-lg md:rounded-2xl overflow-hidden transform transition-all duration-500 ease-out hover:scale-[1.02] hover:border-casino-neon-green/40 hover:shadow-2xl hover:shadow-casino-neon-green/10 active:scale-[0.98] cursor-pointer h-full flex flex-col swiper-slide-center-scale">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-casino-neon-green/5 via-transparent to-casino-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Header with rating badge */}
                <div className="relative p-2 md:p-6 pb-1 md:pb-4">
                  <div className="flex justify-between items-start mb-1 md:mb-4">
                    <h3 className="text-sm md:text-xl font-bold text-white group-hover:text-casino-neon-green transition-colors duration-300 leading-tight">{casino.name}</h3>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 backdrop-blur-sm px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-full text-xs md:text-sm border border-yellow-400/30 flex-shrink-0">
                      <Star className="w-2.5 h-2.5 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-bold text-xs md:text-sm">{casino.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="relative px-2 md:px-6 pb-2 md:pb-6 flex-1">
                  <div className="space-y-1.5 md:space-y-4 mb-2 md:mb-6">
                    <div className="flex items-center gap-1.5 md:gap-3 p-1.5 md:p-3 bg-black/20 rounded-md border border-gray-700/30">
                      <div className="w-5 h-5 md:w-8 md:h-8 bg-casino-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-2.5 h-2.5 md:w-4 md:h-4 text-casino-neon-green" />
                      </div>
                      <p className="text-gray-200 font-medium text-xs md:text-sm leading-tight">{casino.bonus}</p>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-3 p-1.5 md:p-3 bg-black/20 rounded-md border border-gray-700/30">
                      <div className="w-5 h-5 md:w-8 md:h-8 bg-casino-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-2.5 h-2.5 md:w-4 md:h-4 text-casino-neon-green" />
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1">
                        <p className="text-gray-200 font-medium text-xs md:text-sm whitespace-nowrap">Safety:</p>
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <div className="w-10 md:w-16 h-1 md:h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-casino-neon-green to-green-400 transition-all duration-1000 ease-out"
                              style={{ width: `${casino.safety_index}%` }}
                            ></div>
                          </div>
                          <span className="text-casino-neon-green font-bold text-xs md:text-sm whitespace-nowrap">{casino.safety_index}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="relative p-2 md:p-6 pt-0">
                  <a href={casino.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-gradient-to-r from-casino-neon-green to-green-400 text-black font-bold hover:from-casino-neon-green/90 hover:to-green-400/90 hover:shadow-lg hover:shadow-casino-neon-green/25 transition-all duration-300 min-h-[32px] md:min-h-[48px] rounded-md md:rounded-xl group/btn text-xs md:text-base">
                      <span className="flex items-center justify-center gap-1 md:gap-2">
                        Get Bonus
                        <ExternalLink className="w-2.5 h-2.5 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-casino-neon-green/20 hover:border-casino-neon-green/50 transition-all duration-300 group">
          <svg className="w-5 h-5 text-white group-hover:text-casino-neon-green transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-casino-neon-green/20 hover:border-casino-neon-green/50 transition-all duration-300 group">
          <svg className="w-5 h-5 text-white group-hover:text-casino-neon-green transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
