'use client';

import { lazy, Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import CookieConsent from '@/src/components/CookieConsent';
import '@/src/styles/parallax.css';

// Critical components - load immediately
import HeroBannerSlider from '@/src/components/HeroBannerSlider';
import RunningTextTicker from '@/src/components/RunningTextTicker';
import OptimizedNavbar from '@/src/components/OptimizedNavbar';
import PerformanceOptimizer from '@/src/components/PerformanceOptimizer';

// Non-critical components - lazy load with proper loading states
const HeroSection = dynamic(() => import('@/src/components/HeroSection'), {
  loading: () => <div className="h-64 bg-casino-dark-lighter animate-pulse rounded-lg" />
});

const BannerInfo = dynamic(() => import('@/src/components/BannerInfo'), {
  loading: () => <div className="h-48 bg-casino-dark-lighter animate-pulse rounded-lg" />
});

const OptimizedHeroSlider = dynamic(() => import('@/src/components/OptimizedHeroSlider'), {
  loading: () => <div className="h-96 bg-casino-dark-lighter animate-pulse rounded-lg" />
});

// Heavy components - load only when needed
const LogoSlider = lazy(() => import('@/src/components/LogoSlider'));
const OptimizedChart = lazy(() => import('@/src/components/OptimizedChart'));
const Footer = lazy(() => import('@/src/components/Footer'));

// UI Components
import {
  LogoSliderSkeleton,
  ChartSkeleton,
  FooterSkeleton
} from '@/src/components/ui/loading-skeletons';
import SimpleDivider from '@/src/components/ui/SimpleDivider';
import SectionDivider from '@/src/components/ui/SectionDivider';
import { Gift, PartyPopper, Ticket } from 'lucide-react';

const IndexPage = () => {
  // Optimized container classes for better responsive design
  const containerClasses = useMemo(() => 
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", 
  []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-casino-dark via-casino-dark-lighter to-casino-dark overflow-x-hidden">
      {/* Performance Optimizer */}
      <PerformanceOptimizer />
      
      {/* Navigation */}
      <OptimizedNavbar />
      
      {/* Hero Banner - Critical above-the-fold content */}
      <HeroBannerSlider isHomePage={true} />

      {/* Content Container with optimized structure */}
      <div className="relative">
        {/* Running Text Ticker - Positioned overlay */}
        <div className="relative z-10">
          <RunningTextTicker />
        </div>

        {/* Main Content - Better spacing and structure */}
        <main className={containerClasses}>
          {/* Compact divider */}
          <SimpleDivider variant="default" spacing="sm" />

          {/* Hero Section - Lazy loaded */}
          <section className="mb-12">
            <HeroSection />
          </section>

          {/* Why Choose Section */}
          <section className="mb-16">
            <SectionDivider
              title="Why Choose CGSG?"
              subtitle="Your trusted partner for safe and exciting online gambling"
              icon="star"
              variant="premium"
              spacing="md"
            />
            <BannerInfo />
          </section>

          {/* Top Casinos Section */}
          <section className="mb-16">
            <SimpleDivider variant="casino" spacing="md">
              Top Casinos
            </SimpleDivider>
            <OptimizedHeroSlider />
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <SectionDivider
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about CGSG bonuses and rewards"
              icon="gift"
              variant="default"
              spacing="md"
            />

            {/* FAQ Content */}
            <div className="bg-casino-card-bg/50 backdrop-blur-sm rounded-xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-white text-center mb-6">
                How to Get Started
              </h3>
              {/* Mobile-optimized grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-casino-dark-card rounded-lg p-4 border border-casino-border-subtle hover:border-casino-neon-green/30 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-casino-neon-green/20 flex items-center justify-center mr-3">
                      <Gift className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <h4 className="text-white font-semibold">Free Credit Bonus</h4>
                  </div>
                  <p className="text-casino-text-secondary text-sm">
                    Get exclusive bonuses without deposits. Register and claim rewards instantly.
                  </p>
                </div>
                
                <div className="bg-casino-dark-card rounded-lg p-4 border border-casino-border-subtle hover:border-casino-neon-green/30 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-casino-neon-green/20 flex items-center justify-center mr-3">
                      <PartyPopper className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <h4 className="text-white font-semibold">Welcome Bonus</h4>
                  </div>
                  <p className="text-casino-text-secondary text-sm">
                    Double or triple your first deposit with our exclusive welcome offers.
                  </p>
                </div>
                
                <div className="bg-casino-dark-card rounded-lg p-4 border border-casino-border-subtle hover:border-casino-neon-green/30 transition-colors md:col-span-2 lg:col-span-1">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-casino-neon-green/20 flex items-center justify-center mr-3">
                      <Ticket className="w-4 h-4 text-casino-neon-green" />
                    </div>
                    <h4 className="text-white font-semibold">Free Spins</h4>
                  </div>
                  <p className="text-casino-text-secondary text-sm">
                    Enjoy free spins on popular slots. Win big without risking your money.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Partners Section - Lazy loaded */}
          <section className="mb-16">
            <SectionDivider
              title="Our Partners"
              subtitle="Trusted casino brands we work with"
              icon="sparkles"
              variant="minimal"
              spacing="sm"
            />
            <Suspense fallback={<LogoSliderSkeleton />}>
              <LogoSlider />
            </Suspense>
          </section>

          {/* Statistics Section - Lazy loaded */}
          <section className="mb-16">
            <SectionDivider
              title="Statistics & Analytics"
              subtitle="Data-driven insights for better gaming decisions"
              icon="crown"
              variant="minimal"
              spacing="sm"
            />
            <Suspense fallback={<ChartSkeleton />}>
              <OptimizedChart />
            </Suspense>
          </section>

          {/* Footer Section */}
          <section>
            <SimpleDivider variant="minimal" spacing="md" />
            <Suspense fallback={<FooterSkeleton />}>
              <Footer />
            </Suspense>
          </section>
        </main>
      </div>
      
      {/* Cookie Consent - Fixed positioning overlay */}
      <CookieConsent />
    </div>
  );
};

export default IndexPage;
