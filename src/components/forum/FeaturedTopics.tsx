
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Pin, Flame } from 'lucide-react';

const FeaturedTopics = () => {
  const featuredTopics = [
    {
      id: 1,
      title: "Best Online Casinos for 2024 - Community Picks",
      author: "CasinoExpert92",
      replies: 156,
      views: 2834,
      lastReply: "15 minutes ago",
      isPinned: true,
      isHot: true,
      category: "Casino Reviews"
    },
    {
      id: 2,
      title: "New Pragmatic Play Slots - What's Your Favorite?",
      author: "SlotLover",
      replies: 89,
      views: 1567,
      lastReply: "1 hour ago",
      isPinned: false,
      isHot: true,
      category: "Slot Strategies"
    },
    {
      id: 3,
      title: "Withdrawal Issues with XYZ Casino - Need Help",
      author: "PlayerInNeed",
      replies: 23,
      views: 445,
      lastReply: "2 hours ago",
      isPinned: false,
      isHot: false,
      category: "Payment Methods"
    },
    {
      id: 4,
      title: "200% Welcome Bonus at ABC Casino - Worth It?",
      author: "BonusHunter",
      replies: 67,
      views: 1123,
      lastReply: "3 hours ago",
      isPinned: false,
      isHot: false,
      category: "Bonus Hunting"
    }
  ];

  return (
    <div id="featured-topics" className="w-full">
      <h3 className="text-2xl font-bold mb-6 text-center">
        <span className="gradient-text">Featured Topics</span>
      </h3>
      
      <div className="space-y-3 sm:space-y-4 w-full">
        {featuredTopics.map((topic) => (
          <Card 
            key={topic.id} 
            className="bg-casino-card-bg/80 border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-casino-neon-green/5"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {topic.isPinned && (
                        <Pin className="w-3.5 h-3.5 flex-shrink-0 text-casino-neon-green" />
                      )}
                      {topic.isHot && (
                        <Flame className="w-3.5 h-3.5 flex-shrink-0 text-orange-400" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] sm:text-xs px-2 py-0.5 border-casino-border-subtle bg-casino-dark/50 text-gray-300"
                    >
                      {topic.category}
                    </Badge>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-white hover:text-casino-neon-green transition-colors mb-2 line-clamp-2">
                    {topic.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-gray-500">by</span> 
                      <span className="text-casino-neon-green font-medium">{topic.author}</span>
                    </span>
                    <span className="hidden sm:inline-block w-px h-4 bg-casino-border-subtle"></span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 opacity-70" />
                      {topic.replies.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-gray-500">•</span>
                      {topic.views.toLocaleString()} views
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 sm:ml-auto">
                      <span>Last reply:</span>
                      <span className="text-gray-300">{topic.lastReply}</span>
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center sm:justify-end">
                  <div className="p-2 rounded-full bg-casino-dark/50 text-casino-neon-green hover:bg-casino-neon-green/10 transition-colors">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTopics;
