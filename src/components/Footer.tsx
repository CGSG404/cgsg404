'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Shield, Users, Gift } from 'lucide-react';
import CountUp from 'react-countup';
import { useState } from 'react';

// ----- Types -----
export type FooterLink =
  | { name: string; href: string; onClick?: never }
  | { name: string; href?: never; onClick: () => void };
export type FooterSection = { title: string; links: FooterLink[] };

const Footer = () => {
  const [openModal, setOpenModal] = useState<null | 'privacy' | 'terms' | 'contact' | 'about'>(null);

  const footerSections: FooterSection[] = [
    {
      title: 'Casino Reviews',
      links: [
        { name: 'Best Casinos', href: '/games' },
      ]
    },
    {
      title: 'Bonuses & Offers',
      links: [
        { name: 'Welcome Bonuses', href: '/casinos' },
        { name: 'No Deposit', href: '/casinos' },
        { name: 'Free Spins', href: '/casinos' },
        { name: 'Cashback', href: '/casinos' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Forum', href: '/forum' },
        { name: 'User Reviews', href: '/reviews' },
        { name: 'List Report', href: '/list-report' },
        { name: 'Success Stories', href: '/success-stories' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Gambling Guide', href: '/guide' },
        { name: 'News', href: '/news' },
        { name: 'About Us', href: '/about-us' },
      ]
    }
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black border-t border-casino-neon-green/10 relative z-10">
      {/* Full width wrapper with professional gradient background */}
      <div className="w-full">
        {/* Content container - konsisten dengan halaman utama */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Main Footer Content - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
          {/* Brand Section - Responsive */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3 lg:mb-4 hover:opacity-80 transition-opacity"
              aria-label="Go to homepage"
            >
              <div className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 bg-casino-neon-green rounded-lg sm:rounded-xl flex items-center justify-center">
                <Star className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-casino-dark" />
              </div>
              <span className="text-base sm:text-lg lg:text-xl gradient-text font-medium">CasinoGuruSG</span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4">
              Your trusted source for honest casino reviews, safety ratings, and expert gambling advice.
            </p>
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="flex items-center text-casino-neon-green text-xs sm:text-sm">
                <Shield className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                <span>Verified Casinos</span>
              </div>
            </div>
          </div>

          {/* Navigation Sections - Responsive */}
          {footerSections.map((section, index) => (
            <div key={index} className="relative">
              <h3 className="text-white font-normal mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base">{section.title}</h3>
              <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {'onClick' in link ? (
                      <button
                        onClick={link.onClick}
                        className="relative text-gray-400 hover:text-casino-neon-green transition-colors duration-200 text-xs sm:text-sm py-0.5 sm:py-1 focus:outline-none focus:text-casino-neon-green group"
                      >
                        <span className="relative z-10">{link.name}</span>
                        <span className="absolute inset-0 bg-casino-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                      </button>
                    ) : (
                      <Link
                        href={link.href!}
                        className="relative inline-block text-gray-400 hover:text-casino-neon-green transition-colors duration-200 text-xs sm:text-sm py-0.5 sm:py-1 focus:outline-none focus:text-casino-neon-green group"
                      >
                        <span className="relative z-10">{link.name}</span>
                        <span className="absolute inset-0 bg-casino-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Indicators - Responsive */}
        <div className="border-t border-casino-border-subtle pt-4 sm:pt-6 lg:pt-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-casino-neon-green mb-1 sm:mb-1.5 lg:mb-2" />
              <div className="text-sm sm:text-base lg:text-lg font-bold text-white" suppressHydrationWarning>
                <CountUp end={26} duration={1.5} separator="," />+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Verified Casinos</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-blue-400 mb-1 sm:mb-1.5 lg:mb-2" />
              <div className="text-sm sm:text-base lg:text-lg font-bold text-white" suppressHydrationWarning>
                <CountUp end={1081} duration={1.5} separator="," />+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Forum Members Activies</div>
            </div>
            <div className="flex flex-col items-center">
              <Gift className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-casino-neon-purple mb-1 sm:mb-1.5 lg:mb-2" />
              <div className="text-sm sm:text-base lg:text-lg font-bold text-white" suppressHydrationWarning>
                <CountUp end={800} duration={1.5} separator="," />+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Active Bonuses</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-yellow-400 mb-1 sm:mb-1.5 lg:mb-2" />
              <div className="text-sm sm:text-base lg:text-lg font-bold text-white" suppressHydrationWarning>
                <CountUp end={99} duration={1.5} />%
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Trust Score</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Responsive */}
        <div className="border-t border-casino-border-subtle pt-3 sm:pt-4 lg:pt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-0">
            2025 CGSG. All rights reserved. | CasinoGuru Singapore.
          </div>
          <div className="flex space-x-3 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm">
            <Link
              href="/privacy-policy"
              className="relative inline-block text-gray-400 hover:text-casino-neon-green transition-colors duration-200 py-0.5 sm:py-1 focus:outline-none focus:text-casino-neon-green group"
            >
              <span className="relative z-10">Privacy Policy</span>
              <span className="absolute inset-0 bg-casino-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
            </Link>
            <Link
              href="/terms-of-service"
              className="relative inline-block text-gray-400 hover:text-casino-neon-green transition-colors duration-200 py-0.5 sm:py-1 focus:outline-none focus:text-casino-neon-green group"
            >
              <span className="relative z-10">Terms of Service</span>
              <span className="absolute inset-0 bg-casino-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
            </Link>
            <a
              href="https://t.me/ysfcreatorr"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block text-gray-400 hover:text-casino-neon-green transition-colors duration-200 py-0.5 sm:py-1 focus:outline-none focus:text-casino-neon-green group"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute inset-0 bg-casino-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
            </a>
          </div>
        </div>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-casino-card-bg rounded-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setOpenModal(null)}
            >
              
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
