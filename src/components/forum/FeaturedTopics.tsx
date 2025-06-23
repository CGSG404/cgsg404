
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
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-8 text-center">
        <span className="gradient-text">Featured Topics</span>
      </h3>
      
      <div className="space-y-4">
        {featuredTopics.map((topic) => (
          <Card key={topic.id} className="bg-casino-card-bg border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {topic.isPinned && (
                      <Pin className="w-4 h-4 text-casino-neon-green" />
                    )}
                    {topic.isHot && (
                      <Flame className="w-4 h-4 text-orange-400" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {topic.category}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-semibold text-white hover:text-casino-neon-green transition-colors mb-2">
                    {topic.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>by {topic.author}</span>
                    <span>{topic.replies} replies</span>
                    <span>{topic.views} views</span>
                    <span>Last reply: {topic.lastReply}</span>
                  </div>
                </div>
                <MessageCircle className="w-6 h-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTopics;
