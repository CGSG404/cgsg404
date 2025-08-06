'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Star, Shield, Gift, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { databaseApi } from '@/src/lib/database-api';
import type { CasinoForCard } from '@/types/database';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Fallback data (minimal untuk emergency)
const fallbackCasinos = [
  {
    id: 1,
    name: 'CGSG Recommended Casino',
    rating: 4.5,
    bonus: 'Welcome Bonus Available',
    safetyIndex: 'High',
    playUrl: '/casinos-singapore',
    logoUrl: '/placeholder.svg'
  }
];

export default function OptimizedHeroSlider() {
  const [casinos, setCasinos] = useState<CasinoForCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCasinos = async () => {
      try {
        setIsLoading(true);
        // Fetch real data from database
        const data = await databaseApi.getCasinosForCards({
          limit: 8,
          isFeatured: true,
          sortBy: 'rating',
          sortOrder: 'desc'
        });
        
        if (data && data.length > 0) {
          setCasinos(data);
        } else {
          // Use fallback if no data
          setCasinos(fallbackCasinos as any);
        }
      } catch (err) {
        console.error('Error fetching casinos:', err);
        setError('Failed to load casinos');
        setCasinos(fallbackCasinos as any); // Use fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchCasinos();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96 bg-casino-dark-lighter rounded-xl">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-casino-neon-green mx-auto mb-4" />
              <p className="text-casino-text-secondary">Loading featured casinos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && casinos.length === 0) {
    return (
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-casino-dark-card rounded-xl p-8 border border-casino-border-subtle">
            <p className="text-casino-text-muted">Unable to load featured casinos at this time.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green-light"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Featured Casinos
          </h2>
          <p className="text-casino-text-secondary">
            Top-rated casinos handpicked by our experts
          </p>
        </div>

        {/* Casino Slider */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="casino-slider"
          >
            {casinos.map((casino) => (
              <SwiperSlide key={casino.id}>
                <div className="bg-casino-dark-card rounded-xl p-6 border border-casino-border-subtle hover:border-casino-neon-green/30 transition-all duration-300 group">
                  {/* Casino Logo */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                      {casino.logoUrl ? (
                        <img 
                          src={casino.logoUrl} 
                          alt={`${casino.name} logo`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-casino-dark-lighter flex items-center justify-center">
                          <Gift className="w-6 h-6 text-casino-text-muted" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Casino Name */}
                  <h3 className="text-white font-semibold text-center mb-2 line-clamp-2">
                    {casino.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-white font-medium">
                      {casino.rating?.toFixed(1) || '4.0'}
                    </span>
                  </div>

                  {/* Safety Index */}
                  <div className="flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4 text-casino-neon-green mr-2" />
                    <span className="text-casino-text-secondary text-sm">
                      {casino.safetyIndex || 'Safe'}
                    </span>
                  </div>

                  {/* Bonus */}
                  <div className="text-center mb-4">
                    <p className="text-casino-neon-green text-sm font-medium line-clamp-2">
                      {casino.bonus || 'Welcome Bonus Available'}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green-light group-hover:scale-105 transition-transform"
                  >
                    <a 
                      href={casino.playUrl || '/casinos-singapore'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Get Bonus
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-casino-dark-card border border-casino-border-subtle rounded-full flex items-center justify-center text-white hover:bg-casino-neon-green hover:text-casino-dark transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-casino-dark-card border border-casino-border-subtle rounded-full flex items-center justify-center text-white hover:bg-casino-neon-green hover:text-casino-dark transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Button 
            asChild 
            variant="outline" 
            className="border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark"
          >
            <a href="/casinos-singapore">
              View All Casinos
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}