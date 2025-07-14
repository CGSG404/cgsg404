"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasinoSlideshow from '@/components/CasinoSlideshow';
import TopCasinosLeaderboard from '@/components/TopCasinosLeaderboard';


const GamesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-casino-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pb-20">
        <div className="pointer-events-none absolute -inset-10 -z-10 select-none">
          <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-casino-neon-green via-purple-600 to-indigo-600 opacity-30 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 rounded-full bg-purple-700/40 opacity-40 blur-3xl" />
        </div>

        <div className="container mx-auto flex max-w-6xl flex-col items-start gap-10 px-4 md:flex-row md:items-center">
          {/* LEFT TEXT */}
          <div className="max-w-xl flex-1">
            <nav className="mb-3 text-sm text-gray-400">
              <a href="/" className="hover:text-casino-neon-green">Home</a>
              <span className="mx-2">›</span>
              <span className="text-gray-300">Top Games</span>
            </nav>

            <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
              Top Online Games for July 2025 – Expert Picks You Can Trust
            </h1>

            <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
              <img src="/founder.png" alt="Author avatar" width={32} height={32} className="rounded-full" />
              <span className="font-medium text-gray-200">GuruSG.</span>
              <span>·</span>
              <time dateTime="2025-07-10">10 Jul 2025</time>
            </div>

            <p className="mt-6 text-gray-300">
              Discover our curated list of the <span className="font-semibold text-casino-neon-green">TOP 5</span> Casinos this month, evaluated using our unique Safety Index and community insights.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative mx-auto h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 flex-shrink-0">
            <img src="/cgsg-logos.png" alt="Fair game badge" className="object-contain" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <CasinoSlideshow />
      </div>

      {/* Leaderboard Section with green glow */}
      <section className="relative py-16 overflow-hidden bg-casino-darker">
        <div className="pointer-events-none absolute -inset-20 -z-10 bg-casino-neon-green/50 blur-3xl" />
        <div className="container mx-auto px-4">
          <TopCasinosLeaderboard />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GamesPage;
