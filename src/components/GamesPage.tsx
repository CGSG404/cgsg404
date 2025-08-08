"use client";

import ProfessionalNavbar from '@/src/components/ProfessionalNavbar';
import Footer from '@/components/Footer';
import CasinoSlideshow from '@/components/CasinoSlideshow';
import TopCasinosLeaderboard from '@/components/TopCasinosLeaderboard';
import HeroBannerSliderSimple from './HeroBannerSliderSimple';
import RunningTextTicker from './RunningTextTicker';
import SimpleDivider from './ui/SimpleDivider';
import MaintenanceWrapper from './MaintenanceWrapper';
import Image from 'next/image';


const GamesPage: React.FC = () => {
  return (
    <MaintenanceWrapper>
      <div className="min-h-screen bg-casino-dark">
      <ProfessionalNavbar />
      {/* Hero Banner Slider for Games Page */}
      <HeroBannerSliderSimple pageType="games" />

      {/* Running Text Ticker */}
      <RunningTextTicker />

      {/* Divider after Ticker */}
      <SimpleDivider variant="default" spacing="lg" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pb-12">
        <div className="pointer-events-none absolute -inset-10 -z-10 select-none">
          {/* Background pattern without RGB effects */}
        </div>

        <div className="mx-auto max-w-screen-xl flex flex-col items-start gap-6 px-4 sm:px-6 lg:px-8 md:flex-row md:items-center">
          {/* LEFT TEXT */}
          <div className="max-w-xl flex-1">
            <nav className="mb-3 text-sm text-gray-400">
              <a href="/" className="hover:text-casino-neon-green">Home</a>
              <span className="mx-2">›</span>
              <span className="text-gray-300">Top Games</span>
            </nav>

            <h1 className="text-2xl font-extrabold leading-tight text-white md:text-3xl lg:text-4xl">
              Top Online Games for July 2025 – Expert Picks You Can Trust
            </h1>

            <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
              <Image src="/founder.png" alt="Author avatar" width={32} height={32} className="rounded-full" />
              <span className="font-medium text-gray-200">GuruSG.</span>
              <span>·</span>
              <time dateTime="2025-07-10">10 Jul 2025</time>
            </div>

            <p className="mt-4 text-gray-300 text-sm">
              Discover our curated list of the <span className="font-semibold text-casino-neon-green">TOP 5</span> Casinos this month, evaluated using our unique Safety Index and community insights.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 flex-shrink-0">
            <Image src="/cgsg-logos.png" alt="Fair game badge" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <SimpleDivider variant="casino" spacing="sm">
        Featured Games
      </SimpleDivider>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <CasinoSlideshow />
      </div>

      {/* Divider */}
      <SimpleDivider variant="neon" spacing="sm">
        Top Casinos Leaderboard
      </SimpleDivider>

      {/* Leaderboard Section */}
      <section className="relative py-6 overflow-hidden bg-casino-darker">
        <div className="container mx-auto px-4">
          <TopCasinosLeaderboard />
        </div>
      </section>

      {/* Divider */}
      <SimpleDivider variant="minimal" spacing="sm" />

      <Footer />
      </div>
    </MaintenanceWrapper>
  );
};

export default GamesPage;
