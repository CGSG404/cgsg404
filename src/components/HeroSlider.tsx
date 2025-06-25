/**
 * @component HeroSlider
 * @description Komponen React yang menampilkan kumpulan card casino dalam slider horizontal.
 * - Menggunakan SwiperJS untuk fungsionalitas slider otomatis (auto-slide).
 * - Setiap card berisi nama kasino, rating, bonus, dan safety index.
 * - Card memiliki background gelap, sudut membulat, dan tombol "Get Bonus".
 * - Mendukung gestur swipe di perangkat mobile dan auto-slide setiap 3 detik.
 * - Dibuat responsif menggunakan Tailwind CSS.
 */
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star, Shield, Gift, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const casinoData = [
  {
    id: 1,
    name: 'Vegas Royale',
    rating: 4.8,
    bonus: '100% up to $500',
    safetyIndex: 95,
  },
  {
    id: 2,
    name: 'Galaxy Spins',
    rating: 4.9,
    bonus: '200 Free Spins',
    safetyIndex: 98,
  },
  {
    id: 3,
    name: 'Jackpot City',
    rating: 4.7,
    bonus: '$1600 Welcome Bonus',
    safetyIndex: 92,
  },
  {
    id: 4,
    name: 'Spin Palace',
    rating: 4.6,
    bonus: '150% Match Bonus',
    safetyIndex: 94,
  },
    {
    id: 5,
    name: 'Ruby Fortune',
    rating: 4.8,
    bonus: '$750 Bonus',
    safetyIndex: 96,
  },
];

const HeroSlider: React.FC = () => {
  return (
    <div className="relative w-full container mx-auto py-8 md:py-12">
      <div className="absolute inset-0 bg-neon-gradient opacity-10 -z-10"></div>
      <div className="relative z-10">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Pilihan Kasino Online Teratas Kami</h2>
          <p className="text-lg text-gray-400 mt-2">Temukan penawaran terbaik dari kasino paling tepercaya.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={15}
          slidesPerView={1.3}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="mySwiper"
        >
          {casinoData.map((casino) => (
            <SwiperSlide key={casino.id} className="py-4">
              <div className="bg-casino-card-bg border border-gray-700/50 rounded-xl overflow-hidden transform transition-[transform,border-color] duration-300 hover:scale-105 hover:border-casino-neon-green/50 active:scale-100 active:border-casino-neon-green h-full flex flex-col justify-between cursor-pointer">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{casino.name}</h3>
                    <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 rounded-full text-sm flex-shrink-0">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-semibold">{casino.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-casino-neon-green" />
                      <p className="text-gray-300">{casino.bonus}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-casino-neon-green" />
                      <p className="text-gray-300">Safety Index: {casino.safetyIndex}%</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button className="w-full bg-casino-neon-green text-casino-dark font-bold hover:bg-casino-neon-green/90 transition-colors">
                    Get Bonus
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSlider;
