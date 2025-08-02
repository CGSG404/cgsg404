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
      className="relative w-full bg-gradient-to-r from-casino-dark via-casino-dark-lighter to-casino-dark border-y border-casino-neon-green/20 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,153,0.1),transparent_50%)]" />
      </div>

      {/* Ticker Container */}
      <div className="relative py-2 md:py-3">
        {/* Ticker Label */}
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
          <div className="bg-casino-neon-green text-casino-dark px-2 md:px-4 py-1.5 md:py-2 font-bold text-xs md:text-sm flex items-center gap-1 md:gap-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">LIVE</span>
            <span className="sm:hidden">•</span>
          </div>
          <div className="w-0 h-0 border-l-[8px] md:border-l-[12px] border-l-casino-neon-green border-t-[16px] md:border-t-[20px] border-t-transparent border-b-[16px] md:border-b-[20px] border-b-transparent"></div>
        </div>

        {/* Scrolling Content */}
        <div className="ml-12 md:ml-20 overflow-hidden relative">
          <div className={`animate-scroll-seamless ${isPaused ? 'paused' : 'running'}`}>
            {/* Render items multiple times for true seamless scrolling */}
            {[...Array(3)].map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex">
                {tickerItems.map((item, index) => (
                  <div key={`${setIndex}-${item.id}-${index}`} className="flex items-center whitespace-nowrap mr-8 md:mr-12 pointer-events-none">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-casino-neon-green/10 ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <span className="text-white/90 text-xs md:text-sm font-medium">
                        {item.text}
                      </span>
                      {item.highlight && (
                        <span className={`${getTypeColor(item.type)} font-bold text-xs md:text-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-white/10`}>
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

      {/* Gradient Overlays for Smooth Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-casino-dark to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-casino-dark to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default RunningTextTicker;
