'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, Grid, List, Star, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { databaseApi } from '@/src/lib/database-api';
import CasinoCard from '@/src/components/CasinoCard';
import EnhancedSearchBar from '@/src/components/EnhancedSearchBar';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Slider } from '@/src/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchFilters {
  safetyIndex: string[];
  rating: { min: number; max: number };
  features: string[];
  categories: string[];
  isNew: boolean | undefined;
  isHot: boolean | undefined;
  isFeatured: boolean | undefined;
}

const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchFilters>({
    safetyIndex: [],
    rating: { min: 0, max: 5 },
    features: [],
    categories: [],
    isNew: undefined,
    isHot: undefined,
    isFeatured: undefined,
  });

  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'name' | 'created_at'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // Get search results
  const { data: searchResults = [], isLoading, error } = useQuery({
    queryKey: ['search-results', query, filters, sortBy, page],
    queryFn: () => databaseApi.advancedSearch({
      query,
      safetyIndex: filters.safetyIndex.length > 0 ? filters.safetyIndex : undefined,
      rating: filters.rating.min > 0 || filters.rating.max < 5 ? filters.rating : undefined,
      features: filters.features.length > 0 ? filters.features : undefined,
      categories: filters.categories.length > 0 ? filters.categories : undefined,
      isNew: filters.isNew,
      isHot: filters.isHot,
      isFeatured: filters.isFeatured,
      sortBy,
      limit: pageSize,
      offset: page * pageSize,
    }),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Convert search results to casino cards format
  const casinos = searchResults.map(casino => ({
    id: casino.id,
    name: casino.name,
    logo: casino.logo,
    rating: casino.rating,
    safetyIndex: casino.safety_index,
    bonus: casino.bonus,
    features: casino.features?.map(f => f.feature) || [],
    description: casino.description,
    badges: casino.badges?.map(b => b.badge) || [],
    isNew: casino.is_new,
    isHot: casino.is_hot,
    links: {
      bonus: casino.links?.find(l => l.link_type === 'bonus')?.url || '',
      review: casino.links?.find(l => l.link_type === 'review')?.url || '',
      complaint: casino.links?.find(l => l.link_type === 'complaint')?.url || ''
    },
    playUrl: casino.play_url
  }));

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [query, filters, sortBy]);

  // Update filter
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      safetyIndex: [],
      rating: { min: 0, max: 5 },
      features: [],
      categories: [],
      isNew: undefined,
      isHot: undefined,
      isFeatured: undefined,
    });
  };

  // Active filters count
  const activeFiltersCount =
    filters.safetyIndex.length +
    filters.features.length +
    filters.categories.length +
    (filters.rating.min > 0 || filters.rating.max < 5 ? 1 : 0) +
    (filters.isNew !== undefined ? 1 : 0) +
    (filters.isHot !== undefined ? 1 : 0) +
    (filters.isFeatured !== undefined ? 1 : 0);

  if (!query) {
    return (
      <div className="min-h-screen bg-casino-dark text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-2">Search CGSG Casino Guide</h1>
            <p className="text-gray-400 mb-8">Find the perfect casino for your gaming experience</p>
            <div className="max-w-md mx-auto">
              <EnhancedSearchBar autoFocus />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-400">
                {isLoading ? 'Searching...' : `Found ${casinos.length} casino${casinos.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <EnhancedSearchBar
              showFilters
              onFiltersToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="created_at">Newest</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="text-gray-400">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:block bg-casino-card-bg rounded-lg p-6 h-fit border border-casino-border-subtle"
              >
                <h3 className="font-semibold mb-4">Filters</h3>

                {/* Safety Index */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Safety Index
                  </h4>
                  <div className="space-y-2">
                    {['Very High', 'High', 'Medium', 'Low'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={filters.safetyIndex.includes(level)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilter('safetyIndex', [...filters.safetyIndex, level]);
                            } else {
                              updateFilter('safetyIndex', filters.safetyIndex.filter(s => s !== level));
                            }
                          }}
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rating
                  </h4>
                  <div className="px-2">
                    <Slider
                      value={[filters.rating.min, filters.rating.max]}
                      onValueChange={([min, max]) => updateFilter('rating', { min, max })}
                      max={5}
                      min={0}
                      step={0.5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{filters.rating.min}</span>
                      <span>{filters.rating.max}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Quick Filters</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.isNew === true}
                        onCheckedChange={(checked) => updateFilter('isNew', checked ? true : undefined)}
                      />
                      <span className="text-sm">New Casinos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.isHot === true}
                        onCheckedChange={(checked) => updateFilter('isHot', checked ? true : undefined)}
                      />
                      <span className="text-sm">Hot Casinos</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.isFeatured === true}
                        onCheckedChange={(checked) => updateFilter('isFeatured', checked ? true : undefined)}
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 bg-casino-card-bg" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Failed to load search results</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : casinos.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No casinos found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <>
                <motion.div
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {casinos.map((casino, index) => (
                    <motion.div
                      key={casino.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CasinoCard casino={casino} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Load More */}
                {casinos.length === pageSize && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => setPage(prev => prev + 1)}
                      className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
                    >
                      Load More Results
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-casino-dark text-white flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
};

export default SearchPage;