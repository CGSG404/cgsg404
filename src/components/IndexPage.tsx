'use client';

import { lazy, Suspense } from 'react';
import HeroBannerSlider from './HeroBannerSlider';
import RunningTextTicker from './RunningTextTicker';
import HeroSection from './HeroSection';
import BannerInfo from './BannerInfo';
import HeroSlider from './HeroSlider';
import InfoCard from './InfoCard';
import CookieConsent from './CookieConsent';
import Section from './layout/Section';
import Container from './layout/Container';

// Lazy load components for better performance
const LogoSlider = lazy(() => import('./LogoSlider'));
const Chart = lazy(() => import('./Chart'));
const Footer = lazy(() => import('./Footer'));

const IndexPage = () => {
  return (
    <div className="relative">
      {/* Hero Banner with Parallax */}
      <div className="parallax-banner">
        <HeroBannerSlider />
      </div>

      {/* Content Container with Proper Z-Index */}
      <div className="parallax-content">
        {/* Content Overlay for Mobile */}
        <div className="content-overlay">
          {/* Running Text Ticker */}
          <RunningTextTicker />

          {/* Hero Section */}
          <Section padding="none" container={false}>
            <Container>
              <HeroSection />
            </Container>
          </Section>

          {/* Banner Info */}
          <Section padding="md" background="transparent">
            <Container>
              <BannerInfo />
            </Container>
          </Section>

          {/* Hero Slider */}
          <Section padding="lg" background="dark">
            <Container>
              <HeroSlider />
            </Container>
          </Section>

          {/* Info Cards Grid */}
          <Section padding="xl" background="darker">
            <Container>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InfoCard
                  title="Best Casinos"
                  description="Discover the top-rated casinos with the best bonuses and games."
                  icon="star"
                  link="/top-casinos"
                />
                <InfoCard
                  title="Casino Reviews"
                  description="Read detailed reviews from real players and experts."
                  icon="users"
                  link="/reviews"
                />
                <InfoCard
                  title="Forum Community"
                  description="Join our community to discuss and share experiences."
                  icon="message-circle"
                  link="/forum"
                />
              </div>
            </Container>
          </Section>

          {/* Lazy Loaded Components */}
          <Suspense fallback={<div className="h-32 bg-casino-dark animate-pulse rounded-lg" />}>
            <Section padding="lg" background="transparent">
              <Container>
                <LogoSlider />
              </Container>
            </Section>
          </Suspense>

          <Suspense fallback={<div className="h-64 bg-casino-dark animate-pulse rounded-lg" />}>
            <Section padding="xl" background="dark">
              <Container>
                <Chart />
              </Container>
            </Section>
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-casino-dark animate-pulse" />}>
            <Section padding="none" background="darker" container={false}>
              <Footer />
            </Section>
          </Suspense>
        </div>
      </div>

      {/* Cookie Consent - Fixed Position */}
      <CookieConsent />
    </div>
  );
};

export default IndexPage;
