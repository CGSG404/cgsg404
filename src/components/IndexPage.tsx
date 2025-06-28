import { lazy, Suspense } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HeroSlider from '@/components/HeroSlider';
import InfoCard from '@/components/InfoCard';
import { Gift, PartyPopper, Ticket } from 'lucide-react';

const LogoSlider = lazy(() => import('@/components/LogoSlider'));
const Chart = lazy(() => import('@/components/Chart'));
const Footer = lazy(() => import('@/components/Footer'));

const IndexPage = () => {
// Semua logic dan UI utama Index sudah di sini.

  return (
    <div className="min-h-screen bg-casino-dark">
      <Head>
        <title>CGSG - Your Ultimate Guide to Online Casinos & Bonuses</title>
        <meta name="description" content="Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <HeroSection />
      <HeroSlider />
      {/* Bonus Info Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-casino-darker">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            FAQ: What is FWF?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoCard
              icon={<Gift />}
              title="Free Credit Bonus"
              description="Get exclusive bonuses without the need to make a deposit. Simply register and claim your rewards to start playing."
              className="w-full"
            />
            <InfoCard
              icon={<PartyPopper />}
              title="Welcome Bonus"
              description="Double or even triple your first deposit with lucrative welcome offers from our partner casinos."
              className="w-full"
            />
            <InfoCard
              icon={<Ticket />}
              title="Free Spins"
              description="Enjoy free spins on a variety of popular slot games. A golden opportunity to win big without risking your money."
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

export default IndexPage;
