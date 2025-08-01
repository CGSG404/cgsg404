'use client';

import { lazy, Suspense } from 'react';
import Head from 'next/head';
import HeroSection from '@/src/components/HeroSection';
import HeroSlider from '@/src/components/HeroSlider';
import InfoCard from '@/src/components/InfoCard';
import dynamic from 'next/dynamic';

// Dynamic import untuk mencegah hydration mismatch
const HeroBannerSlider = dynamic(() => import('@/src/components/HeroBannerSlider'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[550px] lg:h-[650px] bg-casino-dark flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
        <p className="text-lg">Loading banner...</p>
      </div>
    </div>
  ),
});
import BannerInfo from '@/src/components/BannerInfo';
const PromoBanner = dynamic(() => import('@/src/components/PromoBanner'), {
  ssr: false,
  loading: () => (
    <div className="relative overflow-hidden bg-casino-card-bg/40 backdrop-blur-sm border border-casino-neon-green/30 rounded-2xl mx-4 my-4 shadow-lg">
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-casino-neon-green">
                <div className="w-5 h-5 bg-white rounded"></div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-casino-neon-green">
                Loading bonus offer...
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});
import { Gift, PartyPopper, Ticket } from 'lucide-react';
import {
  LogoSliderSkeleton,
  ChartSkeleton,
  FooterSkeleton
} from '@/src/components/ui/loading-skeletons';
import Divider from '@/src/components/ui/Divider';
import SimpleDivider from '@/src/components/ui/SimpleDivider';
import SectionDivider from '@/src/components/ui/SectionDivider';

// Progressive Loading - Priority-based component loading
const LogoSlider = lazy(() =>
  import('@/src/components/LogoSlider').then(module => ({
    default: module.default
  }))
);

const Chart = lazy(() =>
  import('@/src/components/Chart').then(module => ({
    default: module.default
  }))
);

const Footer = lazy(() =>
  import('@/src/components/Footer').then(module => ({
    default: module.default
  }))
);

const IndexPage = () => {
// Semua logic dan UI utama Index sudah di sini.

  return (
    <div className="min-h-screen bg-casino-dark">
      <Head>
        <title>Guru Singapore - Your Ultimate Guide to Online Casinos & Bonuses</title>
        <meta name="description" content="Find the best online casinos, exclusive bonuses, free credits, and expert reviews. CGSG is your trusted source for safe and exciting online gambling." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeroBannerSlider isHomePage={true} />

      {/* Divider after Hero Banner */}
      <SimpleDivider variant="gradient" spacing="lg" />

      <PromoBanner
        title="🎉 Exclusive CGSG Bonus!"
        subtitle="Get up to 200% welcome bonus + 140 free spins on your first deposit"
        ctaText="Claim Bonus"
        ctaLink="/best-bonuses"
        variant="default"
      />

      {/* Divider after Promo Banner */}
      <SimpleDivider variant="default" spacing="lg" />

      <HeroSection />

      {/* Divider after Hero Section */}
      <SectionDivider
        title="Why Choose CGSG?"
        subtitle="Your trusted partner for safe and exciting online gambling"
        icon="star"
        variant="premium"
        spacing="xl"
      />

      <BannerInfo />

      {/* Divider after Banner Info */}
      <SimpleDivider variant="casino" spacing="lg">
        Top Casinos
      </SimpleDivider>

      <HeroSlider />

      {/* Divider before FAQ Section */}
      <SectionDivider
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about FWF bonuses and rewards"
        icon="gift"
        variant="default"
        spacing="xl"
      />

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

      {/* Divider before Logo Slider */}
      <SectionDivider
        title="Our Partners"
        subtitle="Trusted casino brands we work with"
        icon="sparkles"
        variant="minimal"
        spacing="xl"
      />

      {/* Enhanced Suspense Boundaries - Professional Loading States */}
      <Suspense fallback={<LogoSliderSkeleton />}>
        <LogoSlider />
      </Suspense>

      {/* Divider before Chart */}
      <SectionDivider
        title="Statistics & Analytics"
        subtitle="Data-driven insights for better gaming decisions"
        icon="crown"
        variant="minimal"
        spacing="lg"
      />

      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>

      {/* Divider before Footer */}
      <SimpleDivider variant="minimal" spacing="xl" />

      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default IndexPage;
