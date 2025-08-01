'use client';

import React from 'react';

interface CustomNavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'elegant' | 'hidden';
}

export default function CustomNavigationArrows({ 
  onPrevious, 
  onNext, 
  className = '',
  variant = 'default'
}: CustomNavigationArrowsProps) {
  
  if (variant === 'hidden') {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          button: `w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 
                   text-white rounded-full transition-all duration-200
                   flex items-center justify-center backdrop-blur-sm`,
          icon: 'w-3 h-3 md:w-4 md:h-4'
        };
      
      case 'elegant':
        return {
          button: `w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-casino-neon-green/20 to-emerald-500/20
                   hover:from-casino-neon-green/30 hover:to-emerald-500/30
                   border border-casino-neon-green/40 hover:border-casino-neon-green/60
                   text-casino-neon-green rounded-xl transition-all duration-300
                   flex items-center justify-center backdrop-blur-md
                   hover:scale-110 hover:shadow-xl hover:shadow-casino-neon-green/25`,
          icon: 'w-5 h-5 md:w-6 md:h-6'
        };
      
      default:
        return {
          button: `w-10 h-10 md:w-12 md:h-12 bg-casino-dark/80 hover:bg-casino-dark/90 
                   border border-casino-neon-green/60 hover:border-casino-neon-green
                   text-casino-neon-green rounded-full transition-all duration-300
                   flex items-center justify-center backdrop-blur-sm
                   hover:scale-105 hover:shadow-lg hover:shadow-casino-neon-green/25`,
          icon: 'w-4 h-4 md:w-5 md:h-5'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <>
      {/* Previous Arrow */}
      <button
        onClick={onPrevious}
        className={`absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 ${styles.button} ${className}`}
        aria-label="Previous slide"
      >
        <svg 
          className={styles.icon} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={onNext}
        className={`absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 ${styles.button} ${className}`}
        aria-label="Next slide"
      >
        <svg 
          className={styles.icon} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </>
  );
}

// Alternative icon variants
export const ArrowVariants = {
  // Modern geometric arrows
  geometric: {
    prev: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    ),
    next: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    )
  },

  // Rounded arrows
  rounded: {
    prev: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
      </svg>
    ),
    next: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
      </svg>
    )
  },

  // Elegant curved arrows
  curved: {
    prev: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    ),
    next: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 11v2h12.17l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16.17 11H4z"/>
      </svg>
    )
  }
};
