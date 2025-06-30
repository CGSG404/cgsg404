
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
    features: ['Mini Games', 'Live Service', 'Local Payments'],
    description: 'Huge Your Chance with more Experience Play Large Welcome Bonus',
    badges: ['Slot Games', 'Live Games', 'Sport Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
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
    features: ['Live Service', 'Lucky Draw','Local & Crypto Payments'],
    description: 'Play with Rescue, make your game last much longer & safe.',
    badges: ['Top 5', 'Hot Games', 'Slot Games', 'Live Games', 'Sport Games', 'Arcade Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/lucky-stars',
      review: '/reviews/lucky-stars',
      complaint: '/complaints/lucky-stars'
    },
    playUrl: 'https://top1sg.com/RF295196839',
  },
  {
    id: 4,
    name: 'BK88',
    logo: '/casino-logos/bk88-logos.png',
    rating: 4.8,
    safetyIndex: 'Very High',
    bonus: '150% Welcome Bonus + Free Credit 365 Days',
    features: ['Live Service', 'Lucky Draw', 'Local Payments'],
    description: 'Enjoy a massive 150% Welcome Bonus plus Free Credit available 365 days a year.',
    badges: ['Top5', 'Event Games', 'Hot Games', 'Slot Games', 'Live Games', 'Sport Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/diamond-elite',
      review: '/reviews/diamond-elite',
      complaint: '/complaints/diamond-elite'
    },
    playUrl: 'https://bk888.co/BK88829A860350',
  },
  {
    id: 5,
    name: 'Tokyo99',
    logo: '/casino-logos/tokyo99-logos.png',
    rating: 4.3,
    safetyIndex: 'Medium',
    bonus: 'Welcome Bonus Up To 280% + Monthly Realbet',
    features: ['Live Service', 'Local Payments'],
    description: 'Unlock up to 280% Welcome Bonus + enjoy exclusive Realbet rewards every month.',
    badges: ['Slot Games', 'Live Games', 'Sport Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/crypto-pro',
      review: '/reviews/crypto-pro',
      complaint: '/complaints/crypto-pro'
    },
    playUrl: 'https://www.sgtk99.com/RF12A5032A',
  },
  {
    id: 6,
    name: 'GoRich',
    logo: '/casino-logos/gorich-logos.png',
    rating: 4.4,
    safetyIndex: 'Medium',
    bonus: '50% Welcome Bonus + Vpower Free Credit 365 Days',
    features: ['Live Service', 'Free Movie', 'Deposit Lucky Draw'],
    description: 'Get 50% Welcome Bonus + Vpower Free Credit available every day, 365 days a year.',
    badges: ['Slot Games', 'Live Games', 'Sport Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/classic-vegas',
      review: '/reviews/classic-vegas',
      complaint: '/complaints/classic-vegas'
    },
    playUrl: 'https://gorich.xyz/RF29A861665',
  },
  {
    id: 7,
    name: 'MBS88',
    logo: '/casino-logos/mbs888-logos.png',
    rating: 4.5,
    safetyIndex: 'High',
    bonus: '100% Welcome Bonus + Unlimited Booster 5% & 10%',
    features: ['Live Service', 'Local Payment', 'Mobile App'],
    description: 'Claim 100% Welcome Bonus + enjoy Unlimited 5% & 10% Boosters anytime you play.',
    badges: ['Slot Games', 'Live Games', 'Sport Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/spin-master',
      review: '/reviews/spin-master',
      complaint: '/complaints/spin-master'
    },
    playUrl: 'https://mbs888.online/RF295818622',
  },
  {
    id: 8,
    name: 'GE8',
    logo: '/casino-logos/ge8-logos.png',
    rating: 4.8,
    safetyIndex: 'Very High',
    bonus: 'Welcome Bonus Up To 120% + 365 Days Hot Bonus',
    features: ['Live Service', 'Local & Crypto Payments', 'Lucky Wheel'],
    description: 'Enjoy up to 120% Welcome Bonus + Hot Bonuses every day, 365 days non-stop.',
    badges: ['Top5', 'Slot Games', 'Live Games', 'Sport Games', 'App Games', 'Other Games', 'Not Licensed By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/live-hub',
      review: '/reviews/live-hub',
      complaint: '/complaints/live-hub'
    },
    playUrl: 'https://ge88sg.com/RF295830131',
  },
  {
    id: 9,
    name: 'Phoenix 168',
    logo: '/casino-logos/ph168-logos.png',
    rating: 4.8,
    safetyIndex: 'Very High',
    bonus: 'Welcome Bonus Up To 168% + VIP Loyalty',
    features: ['Live Service', 'Mobile App', 'Local Payments'],
    description: 'Unlock up to 168% Welcome Bonus + enjoy exclusive perks with our VIP Loyalty Program.',
    badges: ['Slot Games', 'Live Games', 'Sport Games', '4D Lottery', 'Other Games', 'Not Lisenced By CGSG'],
    isNew: true,
    links: {
      bonus: '/bonuses/mobile-plus',
      review: '/reviews/mobile-plus',
      complaint: '/complaints/mobile-plus'
    },
    playUrl: 'https://ph168sg.com/RF12500610',
    },
    {
      id: 10,
      name: 'RR4win',
      logo: '/casino-logos/rr4win-logos.png',
      rating: 4.5,
      safetyIndex: 'High',
      bonus: '100% Welcome Bonus + Legendary Monthly Angpao',
      features: ['Live Service', 'Lucky Number', 'Local & Crypto Payments'],
      description: 'Get 100% Welcome Bonus + receive Legendary Monthly Angpao surprises just for you.',
      badges: ['Hot Games', 'Slot Games', 'Live Games', 'Arcade Games', 'Bonus Games', 'Not Lisenced By CGSG'],
      isNew: true,
      links: {
        bonus: '/bonuses/mobile-plus',
        review: '/reviews/mobile-plus',
        complaint: '/complaints/mobile-plus'
      },
      playUrl: 'https://rr4winsg.com/RF301019686',
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
