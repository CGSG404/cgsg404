// Removed Card imports - using custom layout instead
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, StarHalf, Shield, Gift, ExternalLink, Trophy, Medal, Award, Crown, Clock, DollarSign, Zap, TrendingUp, CheckCircle, Gamepad2 } from 'lucide-react';

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
      features: ['VIP Program', 'Fast Withdrawals', 'Local Payments'],
      gameCount: '2000+',
      minDeposit: '$10',
      withdrawalTime: '24h',
      license: 'Curacao',
      established: '2020',
      specialOffer: 'Hot Deal! 🔥'
    },
    {
      rank: 2,
      name: 'BK88',
      rating: 4.8,
      bonus: '150% Welcome Bonus + Free Credit 365 Days',
      safetyIndex: 'Very High',
      logo: '/casino-logos/bk88-logos.png',
      playUrl: 'https://bk888.co/BK88829A860350',
      features: ['VIP Program', 'Fast Withdrawals', 'Local Payments'],
      gameCount: '1800+',
      minDeposit: '$20',
      withdrawalTime: '12h',
      license: 'Malta',
      established: '2019',
      specialOffer: 'Popular Choice ⭐'
    },
    {
      rank: 3,
      name: 'TOP1',
      rating: 4.8,
      bonus: '80% Welcome Bonus + Rescue Bonus',
      safetyIndex: 'Very High',
      logo: '/casino-logos/top1-logos.png',
      playUrl: 'https://top1sg.com/RF295196839',
      features: ['VIP Program', 'Fast Withdrawals', 'Local & Crypto Payments'],
      gameCount: '1500+',
      minDeposit: '$15',
      withdrawalTime: '6h',
      license: 'Curacao',
      established: '2021',
      specialOffer: 'New Player Bonus 🎁'
    },
    {
      rank: 4,
      name: 'OnePlay',
      rating: 4.8,
      bonus: '168% Welcome Bonus + Weekly Mission Up To $228',
      safetyIndex: 'Very High',
      logo: '/casino-logos/1play-logos.png',
      playUrl: 'https://1playsg.vip/RF29551A809',
      features: ['VIP Program', 'Fast Withdrawals', 'Local Payments'],
      gameCount: '1200+',
      minDeposit: '$25',
      withdrawalTime: '24h',
      license: 'Curacao',
      established: '2022',
      specialOffer: 'Weekly Missions 🎯'
    },
    {
      rank: 5,
      name: 'GE8',
      rating: 4.8,
      bonus: 'Welcome Bonus Up To 120% + 100% High Rescue Bonus',
      safetyIndex: 'Very High',
      logo: '/casino-logos/ge8-logos.png',
      playUrl: 'https://ge88sg.com/RF295830131',
      features: ['VIP Program', 'Fast Withdrawals', 'Local & Crypto Payments'],
      gameCount: '1000+',
      minDeposit: '$30',
      withdrawalTime: '12h',
      license: 'Malta',
      established: '2020',
      specialOffer: 'High Rescue Bonus 💰'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-800 fill-yellow-600" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />;
      case 2:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 fill-gray-500" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />;
      case 3:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800 fill-amber-600" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />;
      default:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800 fill-emerald-600" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />;
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



  return (
    <div id="top-casinos-leaderboard" className="w-full">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-casino-neon-green" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Top 5 Casino Leaderboard
          </h2>
        </div>
        <p className="text-gray-400 text-sm sm:text-base">
          Discover the best online casinos with exclusive bonuses and top ratings
        </p>
      </div>

      {/* Casino List */}
      <div className="space-y-3 sm:space-y-4">
        {topCasinos.map((casino) => (
          <div
            key={casino.rank}
            className={`relative group ${
              casino.rank === 1
                ? 'bg-gradient-to-r from-yellow-500/5 via-casino-card-bg/80 to-yellow-500/5 border-l-4 border-l-yellow-400'
                : casino.rank === 2
                ? 'bg-gradient-to-r from-gray-400/5 via-casino-card-bg/80 to-gray-400/5 border-l-4 border-l-gray-400'
                : casino.rank === 3
                ? 'bg-gradient-to-r from-amber-500/5 via-casino-card-bg/80 to-amber-500/5 border-l-4 border-l-amber-500'
                : 'bg-casino-card-bg/60 border-l-4 border-l-casino-neon-green/40'
            } rounded-r-xl p-4 sm:p-6 backdrop-blur-sm shadow-lg hover:shadow-xl`}
          >


            {/* 3D Rank Badge */}
            <div className="absolute -left-3 top-4 sm:top-6 z-10">
              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-black shadow-2xl ${
                casino.rank === 1
                  ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-yellow-900 border-2 border-yellow-200 shadow-yellow-400/50'
                  : casino.rank === 2
                  ? 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 text-gray-800 border-2 border-gray-100 shadow-gray-400/50'
                  : casino.rank === 3
                  ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-amber-900 border-2 border-amber-200 shadow-amber-400/50'
                  : 'bg-gradient-to-br from-casino-neon-green via-emerald-400 to-emerald-600 text-emerald-900 border-2 border-emerald-200 shadow-emerald-400/50'
              }`}>
                {/* Inner shadow for 3D effect */}
                <div className={`absolute inset-0 rounded-full ${
                  casino.rank === 1
                    ? 'shadow-inner shadow-yellow-600/30'
                    : casino.rank === 2
                    ? 'shadow-inner shadow-gray-600/30'
                    : casino.rank === 3
                    ? 'shadow-inner shadow-amber-600/30'
                    : 'shadow-inner shadow-emerald-600/30'
                }`}></div>

                {/* Highlight for 3D effect */}
                <div className={`absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  casino.rank === 1
                    ? 'bg-yellow-100/80'
                    : casino.rank === 2
                    ? 'bg-gray-100/80'
                    : casino.rank === 3
                    ? 'bg-amber-100/80'
                    : 'bg-emerald-100/80'
                }`}></div>

                {/* Rank Number */}
                <span className="relative z-10 font-black text-shadow-sm">#{casino.rank}</span>
              </div>
            </div>

            {/* 3D Special Offer Badge */}
            {casino.specialOffer && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                <div className="relative">
                  <Badge className="bg-gradient-to-br from-casino-neon-green via-emerald-400 to-emerald-500 text-emerald-900 text-xs px-3 py-1.5 rounded-full shadow-lg shadow-emerald-400/40 border border-emerald-200 font-bold">
                    {casino.specialOffer}
                  </Badge>
                  {/* 3D highlight */}
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-emerald-100/70 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Left Section: Logo + Basic Info */}
              <div className="lg:col-span-4 flex items-center space-x-3 sm:space-x-4">
                {/* 3D Rank Icon */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    casino.rank === 1
                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 shadow-yellow-400/40'
                      : casino.rank === 2
                      ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800 shadow-gray-400/40'
                      : casino.rank === 3
                      ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-900 shadow-amber-400/40'
                      : 'bg-gradient-to-br from-emerald-300 to-emerald-500 text-emerald-900 shadow-emerald-400/40'
                  }`}>
                    <div className="relative">
                      {getRankIcon(casino.rank)}
                      {/* Subtle highlight */}
                      <div className={`absolute -top-0.5 -left-0.5 w-1 h-1 rounded-full ${
                        casino.rank === 1
                          ? 'bg-yellow-100/60'
                          : casino.rank === 2
                          ? 'bg-gray-100/60'
                          : casino.rank === 3
                          ? 'bg-amber-100/60'
                          : 'bg-emerald-100/60'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* 3D Casino Logo */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                  {/* Shadow layer */}
                  <div className="absolute inset-0 bg-gray-900/20 rounded-xl transform translate-x-1 translate-y-1"></div>

                  {/* Main logo container */}
                  <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center shadow-xl border-2 border-white/40">
                    {/* Inner shadow for depth */}
                    <div className="absolute inset-0 shadow-inner shadow-gray-300/30 rounded-xl"></div>

                    {/* Highlight */}
                    <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full"></div>

                    {/* Logo image */}
                    <img
                      alt={casino.name}
                      className="relative z-10 w-full h-full object-contain p-1"
                      src={casino.logo}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzBmMTUyYSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDBmZjk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                </div>

                {/* Casino Basic Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base sm:text-xl lg:text-2xl mb-1">
                    {casino.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => {
                        const diff = casino.rating - i;
                        if (diff >= 1) {
                          return <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />;
                        } else if (diff >= 0.5) {
                          return <StarHalf key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />;
                        }
                        return <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />;
                      })}
                    </div>
                    <span className="text-yellow-400 font-semibold text-sm">({casino.rating})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getSafetyColor(casino.safetyIndex)} text-xs`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {casino.safetyIndex === 'Very High' ? 'Very High Safety' : 'High Safety'}
                    </Badge>
                    <Badge className="bg-purple-600 text-white text-xs">
                      {casino.license} Licensed
                    </Badge>
                    <Badge className="bg-blue-600 text-white text-xs">
                      Est. {casino.established}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Center Section: Bonus & Stats */}
              <div className="lg:col-span-5 space-y-4">
                {/* 3D Welcome Bonus */}
                <div className="relative">
                  {/* Shadow layer */}
                  <div className="absolute inset-0 bg-emerald-900/20 rounded-xl transform translate-x-1 translate-y-1"></div>

                  {/* Main bonus container */}
                  <div className="relative bg-gradient-to-br from-casino-neon-green/15 via-emerald-500/10 to-emerald-600/15 border-2 border-casino-neon-green/40 rounded-xl p-4 shadow-xl">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-casino-neon-green/5 to-transparent rounded-xl"></div>

                    {/* Highlight */}
                    <div className="absolute top-2 left-2 w-3 h-3 bg-casino-neon-green/20 rounded-full"></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-casino-neon-green to-emerald-500 rounded-lg flex items-center justify-center shadow-md border border-emerald-200">
                          <Gift className="w-4 h-4 text-emerald-900 fill-emerald-700" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }} />
                        </div>
                        <span className="text-casino-neon-green font-bold text-sm">Welcome Bonus</span>
                      </div>
                      <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">{casino.bonus}</p>
                    </div>
                  </div>
                </div>

                {/* 3D Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                  {[
                    { icon: Gamepad2, label: 'Games', value: casino.gameCount },
                    { icon: DollarSign, label: 'Min Deposit', value: casino.minDeposit },
                    { icon: Clock, label: 'Withdrawal', value: casino.withdrawalTime },
                    { icon: TrendingUp, label: 'Rating', value: `${casino.rating}/5` }
                  ].map((stat, index) => (
                    <div key={index} className="relative">
                      {/* Shadow layer */}
                      <div className="absolute inset-0 bg-gray-900/15 rounded-lg transform translate-x-0.5 translate-y-0.5"></div>

                      {/* Main stat container */}
                      <div className="relative bg-gradient-to-br from-casino-card-bg/60 via-casino-card-bg/40 to-casino-card-bg/60 rounded-lg p-3 text-center border border-casino-border-subtle shadow-lg">
                        {/* Inner highlight */}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/10 rounded-full"></div>

                        {/* Icon container */}
                        <div className="w-6 h-6 bg-gradient-to-br from-casino-neon-green/30 to-emerald-500/30 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-sm border border-casino-neon-green/20">
                          <stat.icon className="w-3 h-3 text-emerald-800 fill-casino-neon-green" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }} />
                        </div>

                        <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                        <div className="text-white font-bold text-sm">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Section: Features & Actions */}
              <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold text-sm">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {casino.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-casino-neon-green/20 text-casino-neon-green border border-casino-neon-green/40 text-xs px-3 py-1"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 3D Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Play Now Button */}
                  <div className="relative flex-1">
                    {/* Shadow layer */}
                    <div className={`absolute inset-0 rounded-xl transform translate-x-1 translate-y-1 ${
                      casino.rank === 1
                        ? 'bg-emerald-900/30'
                        : 'bg-emerald-900/20'
                    }`}></div>

                    {/* Main button */}
                    <Button
                      size="lg"
                      className={`relative w-full ${
                        casino.rank === 1
                          ? 'bg-gradient-to-br from-casino-neon-green via-emerald-400 to-emerald-500 text-emerald-900 shadow-xl shadow-casino-neon-green/30 border-2 border-emerald-200'
                          : 'bg-gradient-to-br from-casino-neon-green via-emerald-400 to-emerald-500 text-emerald-900 shadow-lg shadow-casino-neon-green/20 border border-emerald-300'
                      } font-black text-base py-3 rounded-xl`}
                      onClick={() => {
                        window.open(casino.playUrl, '_blank');
                      }}
                    >
                      {/* Inner highlight */}
                      <div className="absolute top-1 left-3 w-2 h-2 bg-emerald-100/60 rounded-full"></div>

                      <span className="relative flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 fill-emerald-700" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
                        <span>Play Now</span>
                        <ExternalLink className="w-4 h-4 fill-emerald-700" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }} />
                      </span>
                    </Button>
                  </div>

                  {/* Review Button */}
                  <div className="relative">
                    {/* Shadow layer */}
                    <div className="absolute inset-0 bg-gray-900/15 rounded-xl transform translate-x-0.5 translate-y-0.5"></div>

                    {/* Main button */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="relative bg-gradient-to-br from-casino-card-bg/80 to-casino-card-bg/60 border-2 border-casino-neon-green/60 text-casino-neon-green font-bold px-6 py-3 rounded-xl shadow-lg"
                      onClick={() => {
                        // Review functionality can be added here
                      }}
                    >
                      {/* Inner highlight */}
                      <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-casino-neon-green/20 rounded-full"></div>

                      <span className="relative flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 text-casino-neon-green fill-casino-neon-green/70" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }} />
                        <span>Review</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCasinosLeaderboard;
