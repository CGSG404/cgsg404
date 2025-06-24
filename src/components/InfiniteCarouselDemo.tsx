import React from 'react';
import InfiniteCarousel from './InfiniteCarousel';

const InfiniteCarouselDemo = () => {
  // Sample carousel items
  const carouselItems = [
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-casino-neon-green/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🎮</span>
          </div>
          <h3 className="font-bold text-white mb-1">Gaming</h3>
          <p className="text-sm text-gray-400">Experience the best games</p>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-casino-neon-green/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🎲</span>
          </div>
          <h3 className="font-bold text-white mb-1">Casino</h3>
          <p className="text-sm text-gray-400">Try your luck today</p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-casino-neon-green/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="font-bold text-white mb-1">Tournaments</h3>
          <p className="text-sm text-gray-400">Compete for prizes</p>
        </div>
      ),
    },
    {
      id: 4,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-casino-neon-green/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🎰</span>
          </div>
          <h3 className="font-bold text-white mb-1">Slots</h3>
          <p className="text-sm text-gray-400">Spin to win big</p>
        </div>
      ),
    },
    {
      id: 5,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-casino-neon-green/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">♠️</span>
          </div>
          <h3 className="font-bold text-white mb-1">Poker</h3>
          <p className="text-sm text-gray-400">Test your skills</p>
        </div>
      ),
    },
    {
      id: 6,
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="w-16 h-16 bg-casino-neon-green/20 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="font-bold text-white mb-1">Live Games</h3>
          <p className="text-sm text-gray-400">Real-time action</p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-casino-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          Our Gaming Categories
        </h2>
        
        {/* Default Carousel */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-white mb-4">Auto-scrolling Carousel</h3>
          <InfiniteCarousel 
            items={carouselItems.slice(0, 6)}
            speed={3000}
            direction="left"
            showArrows={true}
            showDots={true}
            pauseOnHover={true}
          />
        </div>
        
        {/* Responsive Example */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-white mb-4">Responsive Carousel</h3>
          <InfiniteCarousel 
            items={carouselItems}
            speed={4000}
            direction="right"
            showArrows={false}
            showDots={true}
            className="max-w-4xl mx-auto"
          />
        </div>
        
        {/* Minimal Example */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Minimal Carousel</h3>
          <InfiniteCarousel 
            items={carouselItems.slice(0, 4)}
            speed={3500}
            direction="left"
            showArrows={true}
            showDots={false}
            className="max-w-3xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default InfiniteCarouselDemo;
