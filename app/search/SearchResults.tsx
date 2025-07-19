'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Star, Gamepad2, FileText, Users, TrendingUp, MapPin, BookOpen, AlertTriangle, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Data kata kunci yang sama dengan SearchBar
const searchKeywords = [
  // Casinos
  { keyword: 'casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Explore the best online casinos in Singapore' },
  { keyword: 'online casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Top-rated online casinos with great bonuses' },
  { keyword: 'singapore casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Singapore licensed casinos and gaming sites' },
  { keyword: 'best casino', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Find the best casinos with highest ratings' },
  { keyword: 'casino review', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Detailed casino reviews and ratings' },
  { keyword: 'casino bonus', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Casinos with the best bonus offers' },
  { keyword: 'casino games', category: 'Casinos', icon: <Star className="w-4 h-4" />, href: '/casinos', description: 'Casinos with extensive game libraries' },
  
  // Games
  { keyword: 'games', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Browse all casino games and categories' },
  { keyword: 'slot games', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Popular slot games and jackpots' },
  { keyword: 'live casino', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Live dealer casino games' },
  { keyword: 'poker', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Poker games and tournaments' },
  { keyword: 'blackjack', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Blackjack games and strategies' },
  { keyword: 'roulette', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Roulette games and betting systems' },
  { keyword: 'baccarat', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Baccarat games and rules' },
  { keyword: 'sports betting', category: 'Games', icon: <Gamepad2 className="w-4 h-4" />, href: '/games', description: 'Sports betting and live odds' },
  
  // Reviews
  { keyword: 'reviews', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews', description: 'Read detailed casino and game reviews' },
  { keyword: 'casino review', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews', description: 'Comprehensive casino reviews and ratings' },
  { keyword: 'user review', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews', description: 'User-generated reviews and testimonials' },
  { keyword: 'rating', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews', description: 'Casino ratings and rankings' },
  { keyword: 'testimonial', category: 'Reviews', icon: <FileText className="w-4 h-4" />, href: '/reviews', description: 'Player testimonials and experiences' },
  
  // List Report
  { keyword: 'report', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report', description: 'Report suspicious casinos and activities' },
  { keyword: 'scam report', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report', description: 'Report casino scams and fraud' },
  { keyword: 'complaint', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report', description: 'File complaints against casinos' },
  { keyword: 'blacklist', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report', description: 'Blacklisted casinos and operators' },
  { keyword: 'fraud', category: 'List Report', icon: <AlertTriangle className="w-4 h-4" />, href: '/list-report', description: 'Report fraudulent activities' },
  
  // Forum
  { keyword: 'forum', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum', description: 'Join casino community discussions' },
  { keyword: 'discussion', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum', description: 'Discuss casino topics and strategies' },
  { keyword: 'community', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum', description: 'Casino gaming community' },
  { keyword: 'chat', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum', description: 'Live chat with other players' },
  { keyword: 'help', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum', description: 'Get help from the community' },
  { keyword: 'support', category: 'Forum', icon: <Users className="w-4 h-4" />, href: '/forum', description: 'Community support and assistance' },
  
  // Guide
  { keyword: 'guide', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'Casino gaming guides and tutorials' },
  { keyword: 'tutorial', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'Learn casino games step by step' },
  { keyword: 'how to', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'How to play casino games' },
  { keyword: 'tips', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'Casino gaming tips and tricks' },
  { keyword: 'strategy', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'Casino game strategies' },
  { keyword: 'beginner', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'Beginner guides for casino games' },
  { keyword: 'expert', category: 'Guide', icon: <BookOpen className="w-4 h-4" />, href: '/guide', description: 'Advanced casino gaming techniques' },
  
  // News
  { keyword: 'news', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news', description: 'Latest casino industry news' },
  { keyword: 'latest', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news', description: 'Latest updates and announcements' },
  { keyword: 'update', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news', description: 'Casino industry updates' },
  { keyword: 'announcement', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news', description: 'Important casino announcements' },
  { keyword: 'industry', category: 'News', icon: <Newspaper className="w-4 h-4" />, href: '/news', description: 'Casino industry news and trends' },
  
  // Bonuses
  { keyword: 'bonus', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses', description: 'Best casino bonus offers' },
  { keyword: 'welcome bonus', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses', description: 'Welcome bonuses for new players' },
  { keyword: 'free spins', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses', description: 'Free spins and slot bonuses' },
  { keyword: 'promotion', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses', description: 'Casino promotions and offers' },
  { keyword: 'deposit bonus', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses', description: 'Deposit match bonuses' },
  { keyword: 'no deposit', category: 'Bonuses', icon: <TrendingUp className="w-4 h-4" />, href: '/best-bonuses', description: 'No deposit bonus offers' },
  
  // About
  { keyword: 'about', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us', description: 'Learn about CGSG and our mission' },
  { keyword: 'contact', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us', description: 'Contact CGSG team' },
  { keyword: 'team', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us', description: 'Meet the CGSG team' },
  { keyword: 'company', category: 'About', icon: <MapPin className="w-4 h-4" />, href: '/about-us', description: 'About CGSG company' },
  
  // Success Stories
  { keyword: 'success', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories', description: 'Player success stories and wins' },
  { keyword: 'winner', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories', description: 'Casino winners and jackpots' },
  { keyword: 'jackpot', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories', description: 'Big jackpot wins and stories' },
  { keyword: 'big win', category: 'Success Stories', icon: <TrendingUp className="w-4 h-4" />, href: '/success-stories', description: 'Big wins and success stories' },
];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<typeof searchKeywords>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = searchKeywords.filter(item =>
        item.keyword.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

      // Sort by relevance
      const sorted = results.sort((a, b) => {
        const aExact = a.keyword.toLowerCase().startsWith(query.toLowerCase());
        const bExact = b.keyword.toLowerCase().startsWith(query.toLowerCase());
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.keyword.localeCompare(b.keyword);
      });

      setSearchResults(sorted);
      setLoading(false);
    }, 300);
  }, [query]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Casinos': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Games': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Reviews': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'List Report': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Forum': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Guide': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'News': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Bonuses': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'About': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Success Stories': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (!query.trim()) {
    return (
      <div className="text-center">
        <Search className="w-16 h-16 mx-auto text-casino-neon-green mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">Search CGSG</h1>
        <p className="text-gray-300 mb-8">Enter a keyword to search across all pages</p>
        <Link href="/">
          <Button className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-casino-neon-green" />
          <h1 className="text-2xl font-bold text-white">Search Results</h1>
        </div>
        <p className="text-gray-300">
          Found {loading ? '...' : searchResults.length} results for "{query}"
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-casino-neon-green mx-auto mb-4"></div>
          <p className="text-gray-300">Searching...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searchResults.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((result, index) => (
            <Card key={`${result.keyword}-${index}`} className="bg-casino-card-bg/50 border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-300 hover:shadow-lg hover:shadow-casino-neon-green/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-casino-neon-green">
                      {result.icon}
                    </div>
                    <CardTitle className="text-white text-lg">{result.keyword}</CardTitle>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(result.category)}`}>
                    {result.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  {result.description}
                </CardDescription>
                <Link href={result.href}>
                  <Button className="w-full bg-casino-neon-green hover:bg-casino-neon-green/80 text-casino-dark">
                    Visit {result.category}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && searchResults.length === 0 && query.trim() && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
          <p className="text-gray-300 mb-6">
            We couldn't find any results for "{query}". Try different keywords or check your spelling.
          </p>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Popular searches:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['casino', 'games', 'reviews', 'bonus', 'forum'].map((suggestion) => (
                <Link key={suggestion} href={`/search?q=${encodeURIComponent(suggestion)}`}>
                  <Button variant="outline" size="sm" className="border-casino-border-subtle text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark">
                    {suggestion}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="border-casino-border-subtle text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 