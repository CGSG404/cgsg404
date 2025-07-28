'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CasinoSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/slider-logos-card/top5-casinos.png',
      title: 'Top 5 Leaderboard',
      description: 'Your Safety, Our Priority – Top Casinos You Can Rely On'
    },
    {
      id: 2,
      image: '/slider-logos-card/powerful-casinos.png',
      title: 'No More Fear',
      description: 'We Made Your Gameplay Powerful'
    },
    {
      id: 3,
      image: '/slider-logos-card/guruacademy.png',
      title: 'Guru Academy Casino',
      description: 'Play With Knowledge, Win With Strategy'
    },
    {
      id: 4,
      image: '/slider-logos-card/with-guru.png',
      title: 'Guru Guide Your Game Play',
      description: 'Find Out More About Casino'
    },
    {
      id: 5,
      image: '/slider-logos-card/anywhere.png',
      title: 'Guru & Ys - Always With You',
      description: 'We Never Sleep To Helping You'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl mb-6 group shadow-lg border border-casino-border-subtle/30">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-1">{slide.title}</h3>
                <p className="text-gray-200 text-sm">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-casino-card-bg/80 border-casino-neon-green/30 text-white hover:bg-casino-neon-green/20 hover:border-casino-neon-green/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-casino-card-bg/80 border-casino-neon-green/30 text-white hover:bg-casino-neon-green/20 hover:border-casino-neon-green/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-casino-neon-green scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CasinoSlideshow;
