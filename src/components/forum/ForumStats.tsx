
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle, TrendingUp, Clock } from 'lucide-react';

const ForumStats = () => {
  const forumStats = [
    { label: "Total Members", value: "12,847", icon: Users },
    { label: "Total Topics", value: "3,218", icon: MessageCircle },
    { label: "Total Posts", value: "21,554", icon: TrendingUp },
    { label: "Online Now", value: "287", icon: Clock }
  ];

  return (
    <div className="py-12 bg-casino-card-bg/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {forumStats.map((stat, index) => (
            <Card key={index} className="bg-casino-card-bg border-casino-border-subtle text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 text-casino-neon-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumStats;
