import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, StarHalf, Shield, Gift, ExternalLink, Trophy, Medal, Award, Crown, Newspaper, Compass, MessageCircle, List, Book, Gamepad2, Home } from 'lucide-react';

const TopCasinosLeaderboard = () => {
  const topCasinos = [
    {
      rank: 1,
      name: 'Phoenix168',
      rating: 4.8,
      bonus: 'Welcome Bonus Up To 168% + 100% Bonus Limited Offer',
      safetyIndex: 'Very High',
      logo: '/casino-logos/ph168-logos.png',
      playUrl: 'https://ph168sg.com/RF12500610',
      features: ['VIP Program', 'Fast Withdrawals', 'Local Payments']
    },
    {
      rank: 2,
      name: 'BK88',
      rating: 4.8,
      bonus: '150% Welcome Bonus + Free Credit 365 Days',
      safetyIndex: 'Very High',
      logo: '/casino-logos/bk88-logos.png',
      playUrl: 'https://bk888.co/BK88829A860350',
      features: ['VIP Program', 'Fast Withdrawals', 'Local Payments']
    },
    {
      rank: 3,
      name: 'TOP1',
      rating: 4.8,
      bonus: '80% Welcome Bonus + Rescue Bonus',
      safetyIndex: 'Very High',
      logo: '/casino-logos/top1-logos.png',
      playUrl: 'https://top1sg.com/RF295196839',
      features: ['VIP Program', 'Fast Wirdrawals', 'Local & Crypto Payments']
    },
    {
      rank: 4,
      name: 'OnePlay',
      rating: 4.8,
      bonus: '168% Welcome Bonus + Weekly Mission Up To $228',
      safetyIndex: 'Very High',
      logo: '/casino-logos/1play-logos.png',
      playUrl: 'https://1playsg.vip/RF29551A809',
      features: ['VIP Program', 'Fast Withdrawals', 'Local Payments']
    },
    {
      rank: 5,
      name: 'GE8',
      rating: 4.8,
      bonus: 'Welcome Bonus Up To 120% + 100% High Rescue Bonus',
      safetyIndex: 'Very High',
      logo: '/casino-logos/ge8-logos.png',
      playUrl: 'https://ge88sg.com/RF295830131',
      features: ['VIP Program', 'Fast Withdrawals', 'Local & Crypto Payments']
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-blue-400" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-yellow-300';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black border-gray-200';
    case 3:
      return 'bg-gradient-to-r from-amber-400 to-amber-600 text-black border-amber-300';
    default:
      return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-blue-300';
  }
};





  const getSafetyColor = (index: string) => {
    switch (index) {
      case 'Very High':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-500';
      case 'High':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-500';
    }
  };

  const handleCardClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <Card id="top-casinos-leaderboard" className="border-casino-neon-purple/30 bg-casino-card-bg/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl gradient-text flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-casino-neon-green" />
          Top 5 Casino Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCasinos.map((casino) => (
          <div
            key={casino.rank}
            onClick={() => handleCardClick(casino.playUrl)}
            className={`relative p-4 rounded-lg border cursor-pointer ${
              casino.rank === 1
                ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-yellow-400/30 shadow-lg shadow-yellow-400/20'
                : 'bg-casino-dark-lighter border-casino-border-subtle hover:border-casino-neon-green/30'
            }`}
          >
            {/* Rank Badge */}
            <div className="absolute top-2 left-2">
              <Badge className={`${getRankBadgeColor(casino.rank)} text-xs px-2 py-1 rounded-full shadow-md`}>#{casino.rank}</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start sm:items-center space-x-4">
                {/* Rank Icon - Hide on mobile */}
                <div className="hidden sm:flex flex-shrink-0">
                  {getRankIcon(casino.rank)}
                </div>

                {/* Casino Logo */}
                <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    alt={casino.name}
                    className="w-full h-full object-contain rounded-lg"
                    src={casino.logo}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzBmMTUyYSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDBmZjk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </div>

                {/* Casino Info */}
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg leading-tight sm:leading-normal">{casino.name}</h3>
                    <div className="flex-shrink-0">
                      <Badge 
                        className={`${getSafetyColor(casino.safetyIndex)} text-[10px] sm:text-xs whitespace-nowrap`}
                      >
                        {casino.safetyIndex === 'Very High' ? 'Very High Safety' : 'High Safety'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => {
                        const diff = casino.rating - i;
                        if (diff >= 1) {
                          // Full star
                          return <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
                        } else if (diff >= 0.5) {
                          // Half star
                          return <StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-current" />;
                        }
                        // Empty star
                        return <Star key={i} className="w-4 h-4 text-gray-600" />;
                      })}
                    </div>
                    <span className="text-gray-400 text-sm">({casino.rating}/5)</span>
                  </div>

                  <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="font-semibold text-sm text-casino-neon-green mb-2 line-clamp-2">{casino.bonus}</span>
                    
                  <div className="flex flex-wrap gap-1">
                    {casino.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-casino-dark text-gray-300 text-xs border border-casino-neon-green"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play Button - Full width on mobile, auto on larger screens */}
              <div className="w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0">
                <Button
                  className={`w-full sm:w-auto ${
                    casino.rank === 1
                      ? 'bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90'
                      : 'bg-casino-neon-purple text-white hover:bg-casino-neon-purple/90'
                  } font-bold`}
                  onClick={(e) => {
                    e.stopPropagation(); // Mencegah event bubbling ke parent
                    window.open(casino.playUrl, '_blank');
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="whitespace-nowrap">Play Now</span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopCasinosLeaderboard;
