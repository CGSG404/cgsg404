'use client';

import React, { useState, useMemo } from 'react';
import {
  Gift,
  Star,
  Zap,
  Trophy,
  Crown,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Gem
} from 'lucide-react';

interface TickerItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  highlight?: string;
  type: 'bonus' | 'news' | 'promo' | 'winner' | 'update';
}

const RunningTextTicker: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Data ticker items - memoized to prevent re-creation on every render
  const tickerItems = useMemo<TickerItem[]>(() => [
    {
      id: '1',
      icon: <Gift className="w-4 h-4" />,
      text: 'Find Your Best Bonuses In Our Platform & Claim Your Bonus Now!',
      highlight: 'Exlusive Bonuses',
      type: 'bonus'
    },
    {
      id: '2',
      icon: <Star className="w-4 h-4" />,
      text: 'Check Our Best Recommend CGSG Platform & Start Playing Now!',
      highlight: 'First Class Casinos',
      type: 'news'
    },
    {
      id: '3',
      icon: <Trophy className="w-4 h-4" />,
      text: 'Website Recommend Trophy & Best Monthly Winner!',
      highlight: 'Star Platform',
      type: 'winner'
    },
    {
      id: '4',
      icon: <Zap className="w-4 h-4" />,
      text: 'Find Your Favorite Promotions & Start Playing Now!',
      highlight: '500+ More Promotions',
      type: 'promo'
    },
    {
      id: '5',
      icon: <Crown className="w-4 h-4" />,
      text: 'VIP Program: Unlock Exclusive Benefits and Higher Cashback Rates',
      highlight: 'VIP Program',
      type: 'update'
    },
    {
      id: '6',
      icon: <Sparkles className="w-4 h-4" />,
      text: 'Weekly Bonuses VIP: Become VIP & Get Exclusive Benefits!',
      highlight: 'Exclusive Benefits',
      type: 'promo'
    }
  ], []);



  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bonus':
        return 'text-casino-neon-green';
      case 'news':
        return 'text-blue-400';
      case 'promo':
        return 'text-yellow-400';
      case 'winner':
        return 'text-purple-400';
      case 'update':
        return 'text-orange-400';
      default:
        return 'text-casino-neon-green';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bonus':
        return <Gift className="w-4 h-4" />;
      case 'news':
        return <TrendingUp className="w-4 h-4" />;
      case 'promo':
        return <Target className="w-4 h-4" />;
      case 'winner':
        return <Award className="w-4 h-4" />;
      case 'update':
        return <Gem className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div
      className="relative w-full bg-black border-y border-casino-neon-green/20 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,153,0.1),transparent_50%)]" />
      </div>

      {/* Ticker Container - Responsive */}
      <div className="relative py-1.5 sm:py-2 lg:py-3">
        {/* Ticker Label - Responsive */}
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
          <div className="bg-casino-neon-green text-casino-dark px-1.5 sm:px-2 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-bold text-xs sm:text-xs lg:text-sm flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            <Sparkles className="w-2.5 sm:w-3 lg:w-4 h-2.5 sm:h-3 lg:h-4" />
            <span className="hidden xs:inline text-xs sm:text-xs lg:text-sm">LIVE</span>
            <span className="xs:hidden">•</span>
          </div>
          <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] lg:border-l-[12px] border-l-casino-neon-green border-t-[12px] sm:border-t-[16px] lg:border-t-[20px] border-t-transparent border-b-[12px] sm:border-b-[16px] lg:border-b-[20px] border-b-transparent"></div>
        </div>

        {/* Scrolling Content - Responsive */}
        <div className="ml-8 sm:ml-12 lg:ml-20 overflow-hidden relative">
          <div className={`animate-scroll-seamless ${isPaused ? 'paused' : 'running'}`}>
            {/* Render items multiple times for true seamless scrolling */}
            {[...Array(3)].map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex">
                {tickerItems.map((item, index) => (
                  <div key={`${setIndex}-${item.id}-${index}`} className="flex items-center whitespace-nowrap mr-4 sm:mr-6 lg:mr-8 xl:mr-12 pointer-events-none">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                      <div className={`flex items-center justify-center w-4 sm:w-5 lg:w-6 xl:w-8 h-4 sm:h-5 lg:h-6 xl:h-8 rounded-full bg-casino-neon-green/10 ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <span className="text-white/90 text-xs sm:text-xs lg:text-sm font-medium">
                        {item.text}
                      </span>
                      {item.highlight && (
                        <span className={`${getTypeColor(item.type)} font-bold text-xs sm:text-xs lg:text-sm px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-0.5 lg:py-1 rounded-full bg-white/10`}>
                          {item.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Overlays for Smooth Edges - Responsive */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 lg:w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 lg:w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default RunningTextTicker;
