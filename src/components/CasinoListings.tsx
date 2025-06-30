
import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CasinoCard from './CasinoCard';
import { motion } from 'framer-motion';
import { useIsDesktop } from '@/hooks/useIsDesktop';

interface Casino {
  id: number;
  name: string;
  logo: string;
  safetyIndex: 'Low' | 'Medium' | 'High' | 'Very High';
  badges: string[];
  bonus: string;
  features: string[];
  description: string;
  rating: number;
  isNew?: boolean;
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  playUrl: string;
}

// Static data moved outside the component to prevent re-creation on every render.
const casinos: Casino[] = [
  {
    id: 1,
    name: 'Ducky Luck',
    logo: '/casino-logos/ducky luck.png',
    rating: 4.0,
    safetyIndex: 'Medium',
    bonus: 'Welcome Bonus Up To 400% + Daily Bonus 20%',
    features: ['Live Service', 'Local & CryptoPayments', 'Mobile App'],
    description: 'Kickstart your gaming journey with a massive 400% Welcome Bonus and enjoy a 20% Daily Bonus to boost your winnings.',
    badges: ['Slot Games', 'Live Games', 'Sport Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/royal-spin',
      review: '/reviews/royal-spin',
      complaint: '/complaints/royal-spin'
    },
    playUrl: 'https://ducky7.com/RF12AA9985',
  },
  {
    id: 2,
    name: 'Speed Sgd',
    logo: '/casino-logos/speedsgd-logos.png',
    rating: 4.5,
    safetyIndex: 'High',
    bonus: 'Welcome Bonus Up To 400% + Grand Daily Bonus 100%',
    features: ['Mini Games', 'Live Service', 'Local Payments', 'Mobile App'],
    description: 'Huge Your Chance with more Experience Play Large Welcome Bonus',
    badges: ['Slot Games', 'Live Games', 'Sport Games', 'Other Games'],
    isNew: false,
    links: {
      bonus: '/bonuses/neon-palace',
      review: '/reviews/neon-palace',
      complaint: '/complaints/neon-palace'
    },
    playUrl: 'https://speedsgd.com/RF29A8580A9',
  },
  {
    id: 3,
    name: 'TOP1',
    logo: '/casino-logos/top1-logos.png',
    rating: 4.8,
    safetyIndex: 'Very High',
    bonus: '80% Welcome Bonus + Rescue Bonus',
    features: ['24/7 Support', 'VIP Program', 'Deposit Lucky Draw','Local & Crypto Payments'],
    description: 'Play with Rescue, make your game last much longer & safe.',
    badges: ['Top 5', 'Licensed by CGSG'],
    isNew: false,
    links: {
      bonus: '/bonuses/lucky-stars',
      review: '/reviews/lucky-stars',
      complaint: '/complaints/lucky-stars'
    },
    playUrl: 'https://top1sg.com/RF295196839',
  },
  {
    id: 4,
    name: 'Diamond Elite',
    logo: '/casino-logos/01COMING SOON.png',
    rating: 4.9,
    safetyIndex: 'Very High',
    bonus: '400% Mega Bonus up to $4,000 + 200 Free Spins',
    features: ['High Roller', 'Private Tables', 'Concierge', 'Exclusive Games'],
    description: 'Luxury casino experience designed for high rollers with exclusive games and personalized service.',
    badges: ['VIP', 'High Roller', 'Exclusive'],
    isNew: true,
    links: {
      bonus: '/bonuses/diamond-elite',
      review: '/reviews/diamond-elite',
      complaint: '/complaints/diamond-elite'
    },
    playUrl: 'https://diamondelite.example.com',
  },
  {
    id: 5,
    name: 'Crypto Casino Pro',
    logo: '/casino-logos/01COMING SOON.png',
    rating: 4.5,
    safetyIndex: 'High',
    bonus: '250% Crypto Bonus up to 5 BTC + 125 Free Spins',
    features: ['Bitcoin', 'Ethereum', 'Anonymous Play', 'Fast Withdrawals'],
    description: 'Leading cryptocurrency casino with anonymous gaming and lightning-fast crypto transactions.',
    badges: ['Crypto', 'Anonymous'],
    isNew: true,
    links: {
      bonus: '/bonuses/crypto-pro',
      review: '/reviews/crypto-pro',
      complaint: '/complaints/crypto-pro'
    },
    playUrl: 'https://cryptopro.example.com',
  },
  {
    id: 6,
    name: 'Classic Vegas',
    logo: '/casino-logos/01COMING SOON.png',
    rating: 4.4,
    safetyIndex: 'High',
    bonus: '100% Match Bonus up to $1,000 + 50 Free Spins',
    features: ['Slots', 'Table Games', 'Video Poker', 'Bingo'],
    description: 'Traditional Vegas-style casino with classic games and authentic casino atmosphere online.',
    badges: ['Classic', 'Traditional'],
    isNew: false,
    links: {
      bonus: '/bonuses/classic-vegas',
      review: '/reviews/classic-vegas',
      complaint: '/complaints/classic-vegas'
    },
    playUrl: 'https://classicvegas.example.com',
  },
  {
    id: 7,
    name: 'Spin Master',
    logo: '/casino-logos/01COMING SOON.png',
    rating: 4.3,
    safetyIndex: 'Medium',
    bonus: '175% Bonus up to $1,750 + 88 Free Spins',
    features: ['5000+ Slots', 'Megaways', 'Progressive Slots', 'Tournaments'],
    description: 'Slot specialist casino with the largest collection of slot games and regular tournaments.',
    badges: ['Slots', 'Tournaments'],
    isNew: false,
    links: {
      bonus: '/bonuses/spin-master',
      review: '/reviews/spin-master',
      complaint: '/complaints/spin-master'
    },
    playUrl: 'https://spinmaster.example.com',
  },
  {
    id: 8,
    name: 'Live Casino Hub',
    logo: '/casino-logos/01COMING SOON.png',
    rating: 4.6,
    safetyIndex: 'High',
    bonus: '125% Live Casino Bonus up to $1,250 + Live Chips',
    features: ['Live Dealers', 'Multiple Studios', 'HD Streaming', 'Chat Features'],
    description: 'Specialized live casino platform with professional dealers and multiple studio locations.',
    badges: ['Live Casino', 'HD Quality'],
    isNew: true,
    links: {
      bonus: '/bonuses/live-hub',
      review: '/reviews/live-hub',
      complaint: '/complaints/live-hub'
    },
    playUrl: 'https://livehub.example.com',
  },
  {
    id: 9,
    name: 'Mobile Casino Plus',
    logo: '/casino-logos/01COMING SOON.png',
    rating: 4.2,
    safetyIndex: 'Medium',
    bonus: '200% Mobile Bonus up to $2,000 + 100 Mobile Spins',
    features: ['Mobile Optimized', 'Touch Interface', 'Offline Mode', 'Push Notifications'],
    description: 'Mobile-first casino designed specifically for smartphone and tablet gaming experience.',
    badges: ['Mobile', 'Touch Optimized'],
    isNew: true,
    links: {
      bonus: '/bonuses/mobile-plus',
      review: '/reviews/mobile-plus',
      complaint: '/complaints/mobile-plus'
    },
    playUrl: 'https://mobileplus.example.com',
    }
];

const tabs = [
    { id: 'all', label: 'All Casinos', count: casinos.length },
    { id: 'best', label: 'Best Casinos', count: casinos.filter(c => c.safetyIndex === 'Very High').length },
    { id: 'new', label: 'New Casinos', count: casinos.filter(c => c.isNew).length },
    { id: 'bonuses', label: 'Best Bonuses', count: casinos.filter(c => c.bonus.includes('200%') || c.bonus.includes('300%') || c.bonus.includes('400%')).length },
];

const CasinoListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('safety');
  const [activeTab, setActiveTab] = useState('all');
  const isDesktop = useIsDesktop();

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

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Search and Controls */}
        <div className="bg-casino-card-bg border border-casino-border-subtle rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search casinos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-casino-dark border border-casino-border-subtle rounded-md text-white placeholder-gray-400 focus:border-casino-neon-green focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Sort by:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-casino-dark border-casino-border-subtle text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-casino-card-bg border-casino-border-subtle">
                  <SelectItem value="safety" className="text-white hover:bg-casino-dark">Safety Index</SelectItem>
                  <SelectItem value="rating" className="text-white hover:bg-casino-dark">User Rating</SelectItem>
                  <SelectItem value="name" className="text-white hover:bg-casino-dark">Name (A-Z)</SelectItem>
                  <SelectItem value="newest" className="text-white hover:bg-casino-dark">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-casino-card-bg border border-casino-border-subtle">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-casino-neon-green data-[state=active]:text-casino-dark text-gray-300 hover:text-white"
              >
                {tab.label}
                <span className="ml-2 text-xs bg-casino-dark-lighter px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-casino-neon-green font-semibold">{filteredAndSortedCasinos.length}</span> casino{filteredAndSortedCasinos.length !== 1 ? 's' : ''}
            {searchTerm && (
              <span> matching "<span className="text-white">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Casino Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedCasinos.map((casino) => (
            <CasinoCard key={casino.id} casino={casino} />
          ))}
        </div>

        {filteredAndSortedCasinos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No casinos found</div>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CasinoListings;
