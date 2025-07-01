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
    name: 'OnePlay Singapore',
    rating: 4.8,
    bonus: '168% Welcome Bonus',
    safetyIndex: 90,
    url: 'https://1playsg.vip/RF29551A809',
  },
  {
    id: 2,
    name: 'BK888 Singapore',
    rating: 4.5,
    bonus: '150% Welcome Bonus',
    safetyIndex: 80,
    url: 'https://bk888.co/BK88829A860350',
  },
  {
    id: 3,
    name: 'MBS888 Singapore',
    rating: 4.5,
    bonus: '100% Welcome Bonus',
    safetyIndex: 80,
    url: 'https://mbs888.online/RF295818622',
  },
  {
    id: 4,
    name: 'GE8 Singapore',
    rating: 4.8,
    bonus: 'Welcome Bonus Up To 120%',
    safetyIndex: 90,
    url: 'https://ge88sg.com/RF295830131',
  },
  {
    id: 5,
    name: 'PHOENIX168 Singapore',
    rating: 4.8,
    bonus: 'Welcome Bonus Up To 168%',
    safetyIndex: 90,
    url: 'https://ph168sg.com/RF12500610',
  },
  {
    id: 6,
    name: 'RR4WIN Singapore',
    rating: 4.5,
    bonus: '100% Welcome Bonus',
    safetyIndex: 80,
    url: 'https://rr4winsg.com/RF301019686',
  },
  {
    id: 7,
    name: 'EEBET77 Singapore',
    rating: 4.5,
    bonus: 'Slot Welcome Bonus Up To 200%',
    safetyIndex: 80,
    url: 'https://eebet77.net/RF29555120A',
  },
  {
    id: 8,
    name: 'SGD2U Singapore',
    rating: 4.5,
    bonus: 'Welcome Bonus Up To 240%',
    safetyIndex: 80,
    url: 'https://iclub365.com/RF29555299A',
  },
  {
    id: 9,
    name: 'KOI8 Singapore',
    rating: 4.5,
    bonus: 'Welcome Bonus Up To 120%',
    safetyIndex: 80,
    url: 'https://koi8.me/RF295196092',
  },
    {
    id: 10,
    name: 'TOP1 Singapore',
    rating: 4.8,
    bonus: '80% Welcome Bonus',
    safetyIndex: 90,
    url: 'https://top1sg.com/RF295196839',
  },
];

const HeroSlider: React.FC = () => {
  return (
    <div id="top-casinos" className="relative w-full container mx-auto py-8 md:py-12">
      <div className="absolute inset-0 bg-neon-gradient opacity-10 -z-10"></div>
      <div className="relative z-10">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Top Casinos</h2>
          <p className="text-lg text-gray-400 mt-2">Find the best deals from the most trusted casinos.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={30}
          slidesPerView={1}
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
                  <a href={casino.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-casino-neon-green text-casino-dark font-bold hover:bg-casino-neon-green/90 transition-colors">
                    Get Bonus
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  </a>
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
