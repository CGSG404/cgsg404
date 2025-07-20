'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, TrendingUp, Clock, Star, X, Filter, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { databaseApi } from '@/src/lib/database-api';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  onFiltersToggle?: () => void;
  autoFocus?: boolean;
}

interface SearchSuggestion {
  type: 'casino' | 'feature' | 'category';
  text: string;
  subtitle: string;
  href: string;
  icon: string;
}

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const EnhancedSearchBar = ({ 
  className = '', 
  placeholder = 'Search casinos, features, categories...', 
  showFilters = false,
  onFiltersToggle,
  autoFocus = false
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Get search suggestions from database
  const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => databaseApi.getSearchSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get popular searches
  const { data: popularSearches = [] } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: () => databaseApi.getPopularSearches(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cgsg-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('cgsg-recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const suggestions = suggestionsData?.suggestions || [];
    const totalItems = suggestions.length + (recentSearches.length > 0 ? recentSearches.length : 0) + (popularSearches.length > 0 ? popularSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : -1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          // Handle selection based on index
          if (selectedIndex < suggestions.length) {
            const suggestion = suggestions[selectedIndex];
            router.push(suggestion.href);
            handleClose();
          } else {
            // Handle recent or popular searches
            const searchTerm = selectedIndex < suggestions.length + recentSearches.length 
              ? recentSearches[selectedIndex - suggestions.length]
              : popularSearches[selectedIndex - suggestions.length - recentSearches.length];
            handleSearch(searchTerm);
          }
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      saveRecentSearch(trimmedQuery);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      handleClose();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveRecentSearch(suggestion.text);
    router.push(suggestion.href);
    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('cgsg-recent-searches');
  };

  const suggestions = suggestionsData?.suggestions || [];
  const showDropdown = isOpen && (query.length >= 2 || recentSearches.length > 0 || popularSearches.length > 0);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-12 py-3 bg-casino-card-bg border border-casino-border-subtle rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-casino-neon-green focus:ring-1 focus:ring-casino-neon-green/50 transition-all duration-200"
        />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Filters toggle */}
        {showFilters && (
          <button
            onClick={onFiltersToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-casino-neon-green transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        )}

        {/* Loading indicator */}
        {suggestionsLoading && query.length >= 2 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-casino-neon-green animate-spin" />
          </div>
        )}
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-casino-card-bg rounded-lg shadow-xl border border-casino-border-subtle z-50 max-h-96 overflow-y-auto"
          >
            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-400 px-2 py-1 mb-1">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      selectedIndex === index 
                        ? 'bg-casino-neon-green/10 text-casino-neon-green' 
                        : 'text-gray-300 hover:bg-casino-border-subtle/30'
                    }`}
                  >
                    <span className="text-lg">{suggestion.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{suggestion.text}</div>
                      <div className="text-xs text-gray-400 truncate">{suggestion.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length < 2 && (
              <div className="p-2 border-t border-casino-border-subtle/30">
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <span className="text-xs font-medium text-gray-400">Recent Searches</span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleSearch(search)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      selectedIndex === suggestions.length + index 
                        ? 'bg-casino-neon-green/10 text-casino-neon-green' 
                        : 'text-gray-300 hover:bg-casino-border-subtle/30'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && query.length < 2 && (
              <div className="p-2 border-t border-casino-border-subtle/30">
                <div className="text-xs font-medium text-gray-400 px-2 py-1 mb-1">
                  Popular Searches
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => handleSearch(search)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      selectedIndex === suggestions.length + recentSearches.length + index 
                        ? 'bg-casino-neon-green/10 text-casino-neon-green' 
                        : 'text-gray-300 hover:bg-casino-border-subtle/30'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {query.length >= 2 && suggestions.length === 0 && !suggestionsLoading && (
              <div className="p-4 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs">Try searching for casino names or features</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
