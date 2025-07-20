'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import CasinoCard from './CasinoCard';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { databaseApi } from '@/src/lib/database-api';
import { useIsDesktop } from '@/src/hooks/useIsDesktop';
import type { CasinoForCard } from '@/types/database';
import { Skeleton } from '@/src/components/ui/skeleton';

// Use the database type instead of local interface
type Casino = CasinoForCard;

const CasinoListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('safety');
  const [activeTab, setActiveTab] = useState('all');
  const rawIsDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDesktop = mounted ? rawIsDesktop : false;

  const { data: casinos = [], isLoading, error } = useQuery({
    queryKey: ['casinos'],
    queryFn: () => databaseApi.getCasinosForCards(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const tabs = useMemo(() => [
    { id: 'all', label: 'All Casinos', count: casinos.length },
    { id: 'best', label: 'Best Casinos', count: casinos.filter(c => c.safetyIndex === 'Very High').length },
    { id: 'new', label: 'New Casinos', count: casinos.filter(c => c.isNew).length },
    { id: 'bonuses', label: 'Best Bonuses', count: casinos.filter(c => c.bonus?.match(/(200|300|400)%/)).length },
  ], [casinos]);

  const filteredAndSortedCasinos = useMemo(() => {
    const filtered = casinos.filter(casino => {
      const matchesSearch = casino.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (activeTab) {
        case 'best':
          return matchesSearch && casino.safetyIndex === 'Very High';
        case 'new':
          return matchesSearch && casino.isNew;
        case 'bonuses':
          return matchesSearch && (casino.bonus.includes('200%') || casino.bonus.includes('300%') || casino.bonus.includes('400%'));
        default:
          return matchesSearch;
      }
    });

    // Sort casinos without mutating the original array
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'safety': {
          const safetyOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return safetyOrder[b.safetyIndex] - safetyOrder[a.safetyIndex];
        }
        case 'name': {
          return a.name.localeCompare(b.name);
        }
        case 'newest': {
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
        case 'rating': {
          return b.rating - a.rating;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchTerm, activeTab, sortBy, casinos]);

  // Number of casinos currently shown
  const [visibleCount, setVisibleCount] = useState(10);

  // Reset visible count when filters or search change
  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, activeTab, sortBy]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const visibleCasinos = filteredAndSortedCasinos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedCasinos.length;

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-casino-card-bg rounded-lg p-6 border border-casino-border-subtle">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load casinos</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-casino-dark text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Singapore Casino Guide
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover the best online casinos with our comprehensive reviews, safety ratings, and exclusive bonuses.
          </p>
        </div>

        {/* Enhanced Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search casinos by name, features, or bonus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-casino-card-bg border border-casino-border-subtle rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-casino-neon-green focus:ring-1 focus:ring-casino-neon-green/50 transition-all duration-200"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-casino-card-bg border-casino-border-subtle">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safety">Safety Index</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-casino-card-bg">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-casino-neon-green data-[state=active]:text-casino-dark"
              >
                {tab.label} ({tab.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Casino Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleCasinos.map((casino, index) => (
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

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
                >
                  Load More Casinos
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredAndSortedCasinos.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No casinos found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                  }}
                  className="mt-4 bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CasinoListings;
