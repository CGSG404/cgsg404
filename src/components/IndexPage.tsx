'use client';

import { lazy, Suspense } from 'react';
import Head from 'next/head';
import HeroSection from '@/src/components/HeroSection';
import HeroSlider from '@/src/components/HeroSlider';
import InfoCard from '@/src/components/InfoCard';
import '@/src/styles/parallax.css';

// Direct import untuk HeroBannerSlider - no more dynamic import
import HeroBannerSlider from '@/src/components/HeroBannerSlider';
import BannerInfo from '@/src/components/BannerInfo';
import RunningTextTicker from '@/src/components/RunningTextTicker';
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

      {/* Content Container with proper z-index and background */}
      <div className="parallax-content">
        {/* Smooth transition overlay */}
        <div className="content-overlay">
          {/* Running Text Ticker */}
          <RunningTextTicker />
        </div>

      {/* Divider after Ticker */}
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
      </div>
  );
};

export default IndexPage;
