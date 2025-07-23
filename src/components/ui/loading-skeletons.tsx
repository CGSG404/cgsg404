import React from 'react';

// Hero Section Loading Skeleton
export const HeroSkeleton = () => (
  <section className="relative text-center pt-20 pb-10 md:pt-32 md:pb-16">
    <div className="container mx-auto px-4 relative z-20">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-12 md:h-16 bg-casino-card-bg rounded w-3/4 mx-auto"></div>
          <div className="h-12 md:h-16 bg-casino-neon-green/20 rounded w-1/2 mx-auto"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-8 max-w-3xl mx-auto">
          <div className="h-6 bg-casino-card-bg rounded w-full"></div>
          <div className="h-6 bg-casino-card-bg rounded w-3/4 mx-auto"></div>
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="h-12 bg-casino-neon-green/20 rounded w-48"></div>
          <div className="h-12 bg-casino-card-bg rounded w-48"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-8 w-8 bg-casino-neon-green/20 rounded mx-auto"></div>
              <div className="h-8 bg-casino-card-bg rounded w-16 mx-auto"></div>
              <div className="h-4 bg-casino-card-bg rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Hero Slider Loading Skeleton
export const HeroSliderSkeleton = () => (
  <div className="relative w-full container mx-auto py-8 md:py-12">
    <div className="relative z-10">
      {/* Title skeleton */}
      <div className="text-center mb-8 md:mb-12 animate-pulse">
        <div className="h-10 bg-casino-card-bg rounded w-64 mx-auto mb-4"></div>
        <div className="h-6 bg-casino-card-bg rounded w-96 mx-auto"></div>
      </div>

      {/* Slider skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-casino-card-bg border border-gray-700/50 rounded-xl p-6 h-64">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-700 rounded w-32"></div>
              <div className="h-6 bg-yellow-400/20 rounded w-12"></div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-casino-neon-green/20 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-casino-neon-green/20 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-24"></div>
              </div>
            </div>
            
            <div className="h-10 bg-casino-neon-green/20 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Logo Slider Loading Skeleton
export const LogoSliderSkeleton = () => (
  <div className="py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-casino-card-bg rounded w-64 mx-auto mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-casino-card-bg rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Chart Loading Skeleton
export const ChartSkeleton = () => (
  <div className="py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-casino-card-bg rounded w-48 mx-auto mb-8"></div>
        <div className="h-64 bg-casino-card-bg rounded"></div>
      </div>
    </div>
  </div>
);

// Footer Loading Skeleton
export const FooterSkeleton = () => (
  <div className="py-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-casino-card-bg rounded w-24"></div>
              <div className="space-y-2">
                <div className="h-4 bg-casino-card-bg rounded"></div>
                <div className="h-4 bg-casino-card-bg rounded w-3/4"></div>
                <div className="h-4 bg-casino-card-bg rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-casino-border-subtle mt-8 pt-8">
          <div className="h-4 bg-casino-card-bg rounded w-64 mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
);

// Banner Slider Loading Skeleton
export const BannerSliderSkeleton = () => (
  <div className="relative w-full h-[340px] md:h-[520px] lg:h-[600px]">
    <div className="animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-casino-card-bg to-gray-700 rounded-lg"></div>
      
      {/* Content overlay skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-2xl px-4">
          <div className="h-8 md:h-12 bg-white/20 rounded w-3/4 mx-auto"></div>
          <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-white/20 rounded w-2/3 mx-auto"></div>
          <div className="h-10 bg-casino-neon-green/20 rounded w-32 mx-auto mt-6"></div>
        </div>
      </div>
    </div>
  </div>
);
