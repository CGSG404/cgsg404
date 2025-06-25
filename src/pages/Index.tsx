import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HeroSlider from '@/components/HeroSlider';
import FeaturedCasinos from '@/components/FeaturedCasinos';
import InfoCard from '@/components/InfoCard';
import { Gift, PartyPopper, Ticket } from 'lucide-react';

const LogoSlider = lazy(() => import('@/components/LogoSlider'));
const Chart = lazy(() => import('@/components/Chart'));
const Footer = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />
      <HeroSection />
      <HeroSlider />

      {/* Bonus Info Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-casino-darker">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Temukan Bonus Terbaik Untuk Anda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoCard
              icon={<Gift />}
              title="Bonus Tanpa Deposit"
              description="Dapatkan bonus eksklusif tanpa perlu melakukan deposit. Cukup daftar dan klaim hadiah Anda untuk mulai bermain."
              className="w-full"
            />
            <InfoCard
              icon={<PartyPopper />}
              title="Bonus Selamat Datang"
              description="Gandakan atau bahkan tigakali lipatkan deposit pertama Anda dengan penawaran selamat datang yang menggiurkan dari kasino mitra kami."
              className="w-full"
            />
            <InfoCard
              icon={<Ticket />}
              title="Putaran Gratis (Free Spins)"
              description="Nikmati putaran gratis di berbagai permainan slot populer. Kesempatan emas untuk menang besar tanpa mempertaruhkan uang Anda."
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <LogoSlider />
        <Chart />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
