'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, MapPin, FileText, Users, Star, Gamepad2, Newspaper, BookOpen, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

// Data kata kunci dari seluruh halaman project
const searchKeywords = [
  // Casinos
  { keyword: 'casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  { keyword: 'online casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  { keyword: 'singapore casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  { keyword: 'best casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  { keyword: 'casino review', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  { keyword: 'casino bonus', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  { keyword: 'casino games', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos' },
  
  // Games
  { keyword: 'games', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'slot games', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'live casino', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'poker', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'blackjack', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'roulette', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'baccarat', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  { keyword: 'sports betting', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games' },
  
  // Reviews
  { keyword: 'reviews', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews' },
  { keyword: 'casino review', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews' },
  { keyword: 'user review', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews' },
  { keyword: 'rating', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews' },
  { keyword: 'testimonial', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews' },
  
  // List Report
  { keyword: 'report', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report' },
  { keyword: 'scam report', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report' },
  { keyword: 'complaint', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report' },
  { keyword: 'blacklist', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report' },
  { keyword: 'fraud', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report' },
  
  // Forum
  { keyword: 'forum', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum' },
  { keyword: 'discussion', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum' },
  { keyword: 'community', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum' },
  { keyword: 'chat', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum' },
  { keyword: 'help', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum' },
  { keyword: 'support', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum' },
  
  // Guide
  { keyword: 'guide', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  { keyword: 'tutorial', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  { keyword: 'how to', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  { keyword: 'tips', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  { keyword: 'strategy', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  { keyword: 'beginner', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  { keyword: 'expert', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide' },
  
  // News
  { keyword: 'news', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news' },
  { keyword: 'latest', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news' },
  { keyword: 'update', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news' },
  { keyword: 'announcement', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news' },
  { keyword: 'industry', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news' },
  
  // Bonuses
  { keyword: 'bonus', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses' },
  { keyword: 'welcome bonus', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses' },
  { keyword: 'free spins', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses' },
  { keyword: 'promotion', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses' },
  { keyword: 'deposit bonus', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses' },
  { keyword: 'no deposit', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses' },
  
  // About
  { keyword: 'about', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us' },
  { keyword: 'contact', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us' },
  { keyword: 'team', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us' },
  { keyword: 'company', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us' },
  
  // Success Stories
  { keyword: 'success', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories' },
  { keyword: 'winner', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories' },
  { keyword: 'jackpot', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories' },
  { keyword: 'big win', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories' },
];

// Trending searches (simulasi)
const trendingSearches = [
  'casino bonus',
  'live casino',
  'slot games',
  'casino review',
  'forum discussion'
];

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar = ({ className = '', placeholder = 'Search casinos, games, reviews...' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<typeof searchKeywords>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter results based on query
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredResults([]);
      return;
    }

    const filtered = searchKeywords.filter(item =>
      item.keyword.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by relevance (exact matches first, then partial matches)
    const sorted = filtered.sort((a, b) => {
      const aExact = a.keyword.toLowerCase().startsWith(query.toLowerCase());
      const bExact = b.keyword.toLowerCase().startsWith(query.toLowerCase());
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.keyword.localeCompare(b.keyword);
    });

    setFilteredResults(sorted.slice(0, 8)); // Limit to 8 results
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
          handleResultClick(filteredResults[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Navigate to search results page or perform search
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setQuery('');
      setSelectedIndex(-1);
    }
  };

  // Handle result click
  const handleResultClick = (result: typeof searchKeywords[0]) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  // Handle trending search click
  const handleTrendingClick = (trend: string) => {
    setQuery(trend);
    handleSearch(trend);
  };

  // Close dropdown when clicking outside
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

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setFilteredResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            {/* Search Results */}
            {filteredResults.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                  Search Results
                </div>
                {filteredResults.map((result, index) => (
                  <button
                    key={`${result.keyword}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                  >
                    <div className="text-gray-400">
                      {result.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.keyword}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {query.trim() === '' && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Trending Searches
                </div>
                <div className="flex flex-wrap gap-2 px-2 py-1">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(trend)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query.trim() !== '' && filteredResults.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords or check spelling</p>
              </div>
            )}

            {/* Search Button */}
            {query.trim() !== '' && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => handleSearch(query)}
                  className="w-full"
                  size="sm"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search for "{query}"
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 