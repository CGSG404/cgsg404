'use client';

import { lazy, Suspense, useEffect } from 'react';
import HeroSection from '@/src/components/HeroSection';
import HeroSlider from '@/src/components/HeroSlider';
import InfoCard from '@/src/components/InfoCard';
import ProfessionalNavbar from '@/src/components/ProfessionalNavbar';
import CookieConsent from '@/src/components/CookieConsent';
import '@/src/styles/parallax.css';
import { initViewportFix } from '@/src/utils/viewportFix';

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
import SimpleDivider from '@/src/components/ui/SimpleDivider';
import SectionDivider from '@/src/components/ui/SectionDivider';

// Progressive Loading - Optimized syntax
const LogoSlider = lazy(() => import('@/src/components/LogoSlider'));
const Chart = lazy(() => import('@/src/components/Chart'));
const Footer = lazy(() => import('@/src/components/Footer'));

const IndexPage = () => {
  // Initialize viewport fix for mobile browsers
  useEffect(() => {
    initViewportFix();
  }, []);

  return (
    <div className="app-container bg-black smooth-scroll relative overflow-hidden">
      {/* Metadata moved to app/page.tsx - removed Head component to prevent conflicts */}
      
      {/* Add Navbar with safe area support */}
      <div className="safe-area-top">
        <ProfessionalNavbar />
      </div>
      
      <HeroBannerSlider isHomePage={true} />

      {/* Content Container with proper z-index, background, and mobile optimizations */}
      <div className="parallax-content safe-area-all">
        {/* Smooth transition overlay */}
        <div className="content-overlay">
          {/* Running Text Ticker */}
          <RunningTextTicker />
        </div>

      {/* Divider after Ticker */}
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="sparkles"
          variant="gradient"
          spacing="sm"
        />
      </div>

      <HeroSection />

      {/* Divider after Hero Section */}
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="star"
          variant="premium"
          spacing="sm"
        />
      </div>

      <div className="bg-black relative">
        <div className="relative z-10">
          <HeroSlider />
        </div>
      </div>

      {/* Divider after Top Casinos */}
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="crown"
          variant="premium"
          spacing="sm"
        />
      </div>

      <div className="bg-black relative">
        <div className="relative z-10">
          <BannerInfo />
        </div>
      </div>

      {/* Divider before FAQ Section */}
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="gift"
          variant="default"
          spacing="sm"
        />
      </div>

      {/* Bonus Info Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-white text-center mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              FAQ: What is FWF?
            </span>
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
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="sparkles"
          variant="minimal"
          spacing="sm"
        />
      </div>

      {/* Enhanced Suspense Boundaries - Professional Loading States */}
      <div className="bg-black relative">
        <div className="relative z-10">
          <Suspense fallback={<LogoSliderSkeleton />}>
            <LogoSlider />
          </Suspense>
        </div>
      </div>

      {/* Divider before Chart */}
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="crown"
          variant="minimal"
          spacing="sm"
        />
      </div>

      <div className="bg-black relative">
        <div className="relative z-10">
          <Suspense fallback={<ChartSkeleton />}>
            <Chart />
          </Suspense>
        </div>
      </div>

      {/* Divider before Footer */}
      <div className="bg-black relative py-2">
        <SectionDivider
          icon="users"
          variant="minimal"
          spacing="sm"
        />
      </div>

      <div className="bg-black relative">
        <div className="relative z-10">
          <Suspense fallback={<FooterSkeleton />}>
            <Footer />
          </Suspense>
        </div>
      </div>
      </div>
      
      {/* Add Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default IndexPage;
