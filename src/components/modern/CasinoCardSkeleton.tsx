'use client';

import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';

const CasinoCardSkeleton: React.FC = () => {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-slate-700/50">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4 mb-4">
            {/* Logo Skeleton */}
            <div className="relative w-16 h-16 bg-slate-700 rounded-xl flex-shrink-0 animate-pulse" />

            {/* Casino Info Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 bg-slate-700 rounded animate-pulse w-32" />
              </div>

              {/* Rating Skeleton */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-4 bg-slate-700 rounded animate-pulse w-8" />
              </div>

              {/* Safety Index Skeleton */}
              <div className="h-6 bg-slate-700 rounded-full animate-pulse w-20" />
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
          </div>

          {/* Features Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-700 rounded-full animate-pulse w-16" />
            ))}
          </div>

          {/* Badges Skeleton */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-700 rounded-full animate-pulse w-20" />
            ))}
          </div>
        </div>

        {/* Bonus Section Skeleton */}
        <div className="px-6 pb-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
                <div className="h-4 bg-slate-700 rounded animate-pulse w-24" />
              </div>
              <div className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="h-6 bg-slate-700 rounded animate-pulse w-48" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* Primary CTA Skeleton */}
            <div className="w-full h-12 bg-slate-700 rounded-lg animate-pulse" />

            {/* Secondary Actions Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 bg-slate-700 rounded animate-pulse w-20" />
            </div>
            <div className="h-3 bg-slate-700 rounded animate-pulse w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CasinoCardSkeleton;