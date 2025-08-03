'use client';

import React from 'react';

const CasinoCardHorizontalSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="flex">
        {/* Left Section - Large Logo Skeleton */}
        <div className="w-64 bg-gray-800 p-8 flex flex-col items-center justify-center border-r border-gray-700 relative">
          {/* Position Badge Skeleton */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-gray-600 rounded-full"></div>
          
          {/* Large Casino Logo Skeleton - No Border */}
          <div className="relative">
            <div className="w-32 h-32 bg-gray-600"></div>
          </div>
        </div>

        {/* Middle Section - Details with Casino Title & Safety Index Skeleton */}
        <div className="flex-1 p-6 bg-gray-900">
          {/* Casino Title Skeleton */}
          <div className="mb-4">
            <div className="w-40 h-8 bg-gray-700 rounded mb-2"></div>
          </div>

          {/* Safety Index Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Safety Index Skeleton */}
              <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg">
                <div className="w-5 h-5 bg-gray-600 rounded"></div>
                <div className="w-20 h-4 bg-gray-600 rounded"></div>
                <div className="w-8 h-6 bg-gray-600 rounded"></div>
                <div className="w-16 h-5 bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Action Icons Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Rating & Badges Skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="w-8 h-4 bg-gray-700 rounded"></div>
            </div>

            {/* Badges Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-5 bg-gray-700 rounded"></div>
              <div className="w-12 h-5 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Casino Type Skeleton */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <div className="w-24 h-4 bg-gray-700 rounded"></div>
            </div>
            
            {/* Features List Skeleton */}
            <div className="space-y-1">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <div className="w-32 h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Section Skeleton */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-gray-600 rounded"></div>
              <div className="w-12 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="w-48 h-6 bg-gray-600 rounded mb-1"></div>
            <div className="w-16 h-3 bg-gray-600 rounded"></div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-28 h-10 bg-gray-700 rounded-lg"></div>
            <div className="w-28 h-10 bg-gray-700 rounded-lg"></div>
            <div className="w-20 h-10 bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Right Section - Language & Games Skeleton */}
        <div className="w-64 bg-gray-800 p-6 border-l border-gray-700">
          {/* Language Options Skeleton */}
          <div className="mb-6">
            <div className="w-24 h-4 bg-gray-600 rounded mb-3"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <div className="w-32 h-4 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Games Skeleton */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-20 h-4 bg-gray-600 rounded"></div>
              <div className="w-12 h-3 bg-gray-600 rounded"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="w-full h-8 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>

          {/* Payment Methods Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-24 h-4 bg-gray-600 rounded"></div>
              <div className="w-16 h-3 bg-gray-600 rounded"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="w-10 h-8 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoCardHorizontalSkeleton;