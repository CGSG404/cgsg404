'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import {
  Trophy,
  TrendingUp,
  Shield,
  Star,
  AlertCircle,
  Loader2,
  Home,
  Calendar,
  Gift,
  Gamepad2
} from 'lucide-react';
import { toast } from 'sonner';

// Components
import CasinoCardHorizontal from '@/src/components/modern/CasinoCardHorizontal';
import CasinoCardHorizontalSkeleton from '@/src/components/modern/CasinoCardHorizontalSkeleton';
import CasinoFilters, { FilterOptions } from '@/src/components/modern/CasinoFilters';
import CasinoErrorBoundary, { CasinoErrorFallback } from '@/src/components/modern/CasinoErrorBoundary';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

// Types
interface CasinoV2 {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safetyIndex: 'Very High' | 'High' | 'Medium' | 'Low';
  bonus: string;
  description: string;
  playUrl: string;
  isNew?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  features: string[];
  badges: string[];
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CasinosResponse {
  casinos: CasinoV2[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableFeatures: string[];
  availableBadges: string[];
}

// API Functions
const fetchCasinos = async (filters: FilterOptions, page: number = 1, limit: number = 12): Promise<CasinosResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: filters.search,
    safetyIndex: filters.safetyIndex.join(','),
    minRating: filters.minRating.toString(),
    maxRating: filters.maxRating.toString(),
    features: filters.features.join(','),
    badges: filters.badges.join(','),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    // Fix parameter names to match API expectations
    isFeatured: filters.showFeaturedOnly.toString(),
    isNew: filters.showNewOnly.toString(),
    isHot: filters.showHotOnly.toString(),
  });

  const response = await fetch(`/api/casinos?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch casinos: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Default filters
const defaultFilters: FilterOptions = {
  search: '',
  safetyIndex: [],
  minRating: 0,
  maxRating: 5,
  features: [],
  badges: [],
  sortBy: 'featured',
  sortOrder: 'desc',
  showFeaturedOnly: false,
  showNewOnly: false,
  showHotOnly: false,
};

// Main Component
const CasinosV2Page: React.FC = () => {
  // State
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const limit = 12;

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('casino-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: number[]) => {
    try {
      localStorage.setItem('casino-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }, []);

  // React Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['casinos-v2', filters, currentPage, limit],
    queryFn: () => fetchCasinos(filters, currentPage, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Debug logging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debug - Query state:', {
        isLoading,
        isError,
        error: error?.message,
        data,
        casinos: data?.casinos,
        casinosLength: data?.casinos?.length,
        total: data?.total
      });
    }
  }, [isLoading, isError, error, data]);

  // Handlers
  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFavorite = useCallback((casinoId: number) => {
    const newFavorites = favorites.includes(casinoId)
      ? favorites.filter(id => id !== casinoId)
      : [...favorites, casinoId];
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const handleShare = useCallback((casino: CasinoV2) => {
    if (navigator.share) {
      navigator.share({
        title: `${casino.name} - Casino Review`,
        text: `Check out ${casino.name} casino with ${casino.rating}/5 rating and ${casino.safetyIndex} safety index.`,
        url: window.location.origin + `/casinos/${casino.slug}`,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const url = window.location.origin + `/casinos/${casino.slug}`;
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Casino URL copied to clipboard!');
      }).catch(console.error);
    }
  }, []);


  // Computed values
  const totalResults = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const availableFeatures = data?.availableFeatures || [];
  const availableBadges = data?.availableBadges || [];
  
  // Memoize casinos to prevent unnecessary re-renders
  const casinos = useMemo(() => data?.casinos || [], [data?.casinos]);

  // Stats
  const stats = useMemo(() => {
    if (!casinos.length) return null;

    const featuredCount = casinos.filter(c => c.isFeatured).length;
    const newCount = casinos.filter(c => c.isNew).length;
    const highSafetyCount = casinos.filter(c => c.safetyIndex === 'Very High' || c.safetyIndex === 'High').length;
    const avgRating = casinos.reduce((sum, c) => sum + c.rating, 0) / casinos.length;

    return {
      featured: featuredCount,
      new: newCount,
      highSafety: highSafetyCount,
      avgRating: Math.round(avgRating * 10) / 10,
    };
  }, [casinos]);

  // Error handling
  if (isError) {
    return (
      <CasinoErrorBoundary>
        <div className="container mx-auto px-4 py-8">
          <CasinoErrorFallback
            error={error as Error}
            onRetry={() => refetch()}
            message="Failed to load casinos"
          />
        </div>
      </CasinoErrorBoundary>
    );
  }

  return (
    <CasinoErrorBoundary>
      <Head>
        <title>Best Online Casinos 2024 - Verified Reviews & Ratings</title>
        <meta
          name="description"
          content="Discover the best online casinos with our comprehensive reviews, safety ratings, and exclusive bonuses. Find trusted casinos with high safety index and great player reviews."
        />
        <meta name="keywords" content="online casinos, casino reviews, casino bonuses, safe casinos, casino ratings" />
        <link rel="canonical" href="/casinos-singapore" />
      </Head>

      <div className="min-h-screen bg-gray-900 pt-16">
        {/* Modern Header with Gradient Background - Full Height */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-purple-800 overflow-hidden -mt-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-emerald-400/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-400/30 rounded-full blur-md"></div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm mb-8">
              <a href="/" className="flex items-center text-white/80 hover:text-white transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </a>
              <span className="text-white/60">›</span>
              <span className="text-white font-medium">Best online casinos</span>
            </nav>

            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Left Content */}
              <div className="lg:w-2/3 mb-8 lg:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Best Online Casinos for
                  <span className="block text-emerald-300">August 2025</span>
                  <span className="block text-2xl md:text-3xl font-normal text-white/90 mt-2">
                    Expert Picks You Can Trust
                  </span>
                </h1>
                
                {/* Author & Date */}
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">CG</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Casino Guru Team</p>
                    <div className="flex items-center text-white/70 text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      01 Aug 2025
                    </div>
                  </div>
                </div>

                <p className="text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
                  We've reviewed more than <span className="font-bold text-emerald-300">7,000 online casinos</span> to bring you the
                  TOP 10 for August. Each is rated using our unique Safety Index,
                  developed by experts, grounded in real casino data, and shaped by
                  insights from our active community. <span className="font-semibold">Find the best online casino for you.</span>
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-emerald-300">7K+</span>
                      <span className="text-white/80 ml-2 text-sm">Casinos Reviewed</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-purple-300">TOP 10</span>
                      <span className="text-white/80 ml-2 text-sm">Expert Picks</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-yellow-300">100%</span>
                      <span className="text-white/80 ml-2 text-sm">Verified Safe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Decorative Casino Elements */}
              <div className="lg:w-1/3 relative">
                <div className="relative">
                  {/* Main Casino Card Mockup */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        #1 PICK
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Casino Guru</h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        ★★★★★
                      </div>
                      <span className="text-white/80 ml-2 text-sm">9.8/10</span>
                    </div>
                    <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-center font-semibold flex items-center justify-center">
                      <Gift className="w-4 h-4 mr-2" />
                      125% Welcome Bonus
                    </div>
                  </div>

                  {/* Background Cards */}
                  <div className="absolute -top-4 -right-4 w-24 h-32 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl opacity-60 transform -rotate-12"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-28 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl opacity-40 transform rotate-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Section - Moved here */}
          <div className="mb-8">

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-sm text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{stats.featured}</span>
                  </div>
                  <p className="text-sm text-gray-300">Featured</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-sm text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{stats.new}</span>
                  </div>
                  <p className="text-sm text-gray-300">New</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-sm text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{stats.highSafety}</span>
                  </div>
                  <p className="text-sm text-gray-300">High Safety</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-sm text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-2xl font-bold text-white">{stats.avgRating}</span>
                  </div>
                  <p className="text-sm text-gray-300">Avg Rating</p>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="mb-8">
            <CasinoFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableFeatures={availableFeatures}
              availableBadges={availableBadges}
              totalResults={totalResults}
              isLoading={isLoading || isFetching}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <CasinoCardHorizontalSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Casino List */}
          {!isLoading && casinos.length > 0 && (
            <>
              <div className="space-y-6 mb-8">
                {casinos.map((casino, index) => (
                  <CasinoCardHorizontal
                    key={casino.id}
                    casino={casino}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                    isFavorited={favorites.includes(casino.id)}
                    priority={index < 3} // Prioritize first 3 images
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isFetching}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                      if (pageNum > totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isFetching}
                          className={
                            currentPage === pageNum
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "border-gray-600 text-gray-300 hover:bg-gray-800"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isFetching}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!isLoading && casinos.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No casinos found
              </h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your filters or search terms to find more casinos.
              </p>
              <Button
                onClick={() => handleFiltersChange(defaultFilters)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Loading Indicator */}
          {isFetching && !isLoading && (
            <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2 text-gray-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Updating...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CasinoErrorBoundary>
  );
};

export default CasinosV2Page;