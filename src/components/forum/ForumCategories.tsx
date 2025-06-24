
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, TrendingUp, Flame } from 'lucide-react';

const ForumCategories = () => {
  const forumCategories = [
    {
      id: 1,
      name: "Casino Reviews & Discussions",
      description: "Share your experiences and discuss online casinos",
      topics: 1247,
      posts: 8934,
      lastPost: "2 hours ago",
      icon: MessageCircle,
      color: "bg-casino-neon-green/20 text-casino-neon-green"
    },
    {
      id: 2,
      name: "Slot Machine Strategies",
      description: "Tips, tricks and strategies for slot games",
      topics: 892,
      posts: 5621,
      lastPost: "4 hours ago",
      icon: TrendingUp,
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      id: 3,
      name: "Bonus Hunting",
      description: "Find and discuss the best casino bonuses",
      topics: 634,
      posts: 4123,
      lastPost: "1 hour ago",
      icon: Flame,
      color: "bg-orange-500/20 text-orange-400"
    },
    {
      id: 4,
      name: "Payment Methods",
      description: "Discuss deposits, withdrawals and payment options",
      topics: 445,
      posts: 2876,
      lastPost: "6 hours ago",
      icon: Users,
      color: "bg-purple-500/20 text-purple-400"
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {forumCategories.map((category) => (
          <Card 
            key={category.id} 
            className="bg-casino-card-bg/80 border-casino-border-subtle hover:border-casino-neon-green/50 transition-all duration-300 group cursor-pointer h-full flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${category.color} flex-shrink-0`}>
                  <category.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-white group-hover:text-casino-neon-green transition-colors text-lg md:text-xl line-clamp-2">
                    {category.name}
                  </CardTitle>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <div className="flex flex-wrap justify-between gap-2 text-xs md:text-sm text-gray-400">
                <span className="inline-flex items-center gap-1 bg-casino-dark/50 px-2 py-1 rounded">
                  <MessageCircle className="w-3 h-3" />
                  {category.topics.toLocaleString()} topics
                </span>
                <span className="inline-flex items-center gap-1 bg-casino-dark/50 px-2 py-1 rounded">
                  {category.posts.toLocaleString()} posts
                </span>
                <span className="inline-flex items-center gap-1 bg-casino-dark/50 px-2 py-1 rounded">
                  Last: {category.lastPost}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForumCategories;
