import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselItem = {
  id: string | number;
  content: React.ReactNode;
};

type InfiniteCarouselProps = {
  items: CarouselItem[];
  speed?: number; // milliseconds between slides
  direction?: 'left' | 'right';
  showArrows?: boolean;
  showDots?: boolean;
  pauseOnHover?: boolean;
  className?: string;
};

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  items,
  speed = 3000,
  direction = 'left',
  showArrows = true,
  showDots = false,
  pauseOnHover = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Create a duplicate set of items for seamless looping
  const carouselItems = [...items, ...items, ...items];
  const itemCount = items.length;

  const moveToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return;
    
    const itemWidth = carouselRef.current.offsetWidth / 3; // Show 3 items at a time
    const newPosition = -index * itemWidth;
    
    carouselRef.current.style.transform = `translateX(${newPosition}px)`;
    setCurrentIndex(index % itemCount);
  }, [itemCount]);

  const nextSlide = useCallback(() => {
    moveToIndex((currentIndex + 1) % itemCount);
  }, [currentIndex, itemCount, moveToIndex]);

  const prevSlide = useCallback(() => {
    moveToIndex((currentIndex - 1 + itemCount) % itemCount);
  }, [currentIndex, itemCount, moveToIndex]);

  // Auto-scroll animation
  const animate = useCallback((timestamp: number) => {
    if (isPaused || !carouselRef.current) {
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;

    if (deltaTime >= speed) {
      if (direction === 'left') {
        nextSlide();
      } else {
        prevSlide();
      }
      lastTimeRef.current = timestamp;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, speed, direction, nextSlide, prevSlide]);

  // Set up and clean up animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      moveToIndex(currentIndex);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, moveToIndex]);

  // Handle hover events
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevSlide();
    }
  };

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          width: `${(carouselItems.length / 3) * 100}%`,
        }}
      >
        {carouselItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className="flex-shrink-0 px-2 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6"
          >
            <div className="bg-white/5 rounded-lg p-4 h-full border border-gray-800 hover:border-casino-neon-green/30 transition-all duration-300">
              {item.content}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="flex justify-center mt-4 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => moveToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-casino-neon-green w-6' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InfiniteCarousel;
