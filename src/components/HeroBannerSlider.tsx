import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './HeroBannerSlider.css';

const banners = [
  {
    img: '/news-banner/domain.png',
    title: 'Süße Gewinne warten!',
    subtitle: '200 % bis zu 1.000 € + 140 Freispiele',
    highlight: 'HOL DIR DEIN EXTRA! 🍦',
    cta: 'Registrieren',
    ctaLink: '/auth',
  },
  {
    img: '/news-banner/domain1.png',
    title: 'Willkommen bei CGSG!',
    subtitle: 'Exklusive Boni für neue Spieler',
    highlight: 'JETZT BONUS SICHERN!',
    cta: 'Mehr erfahren',
    ctaLink: '/best-bonuses',
  },
  {
    img: '/success-stories-cgsg.png',
    title: 'Erfolgsgeschichten',
    subtitle: 'Unsere Community gewinnt groß!',
    highlight: 'Werde Teil der Gewinner!',
    cta: 'Erfolg sehen',
    ctaLink: '/success-stories',
  },
];

export default function HeroBannerSlider() {
  return (
    <div className="relative w-full hero-banner-slider">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        navigation
        className="w-full"
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[340px] md:h-[520px] lg:h-[600px]">
              <img src={banner.img} alt={banner.title} className="object-cover w-full h-full absolute inset-0 z-0" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />
              <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-transparent to-[#0e181c] z-20 pointer-events-none" />
              <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
                <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">{banner.title}</h2>
                <div className="text-white text-3xl md:text-6xl font-extrabold mb-2 drop-shadow-lg leading-tight">
                  {banner.subtitle}
                </div>
                <div className="text-yellow-400 text-lg md:text-2xl font-bold mb-6">
                  {banner.highlight}
                </div>
                <a href={banner.ctaLink} className="inline-block">
                  <button className="bg-[#e6003a] hover:bg-[#c20030] text-white text-lg md:text-2xl font-bold px-12 py-4 rounded shadow-lg transition-colors">
                    {banner.cta}
                  </button>
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 