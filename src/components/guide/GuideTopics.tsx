import { Card, CardContent } from '@/src/components/ui/card';
import { Shield, Gift, Gamepad2, Heart, Award, TrendingUp, Users, Clock } from 'lucide-react';

const GuideTopics = () => {
  const beginnerTopics = [
    {
      icon: Shield,
      title: 'Casino Safety & Security',
      description: 'Learn to identify licensed casinos, check SSL certificates, and verify fair gaming practices.',
      level: 'Beginner',
      readTime: 'July 2'
    },
    {
      icon: Gift,
      title: 'Understanding Casino Bonuses',
      description: 'Master welcome bonuses, free spins, cashback offers, and wagering requirements.',
      level: 'Beginner',
      readTime: 'July 2'
    },
    {
      icon: Gamepad2,
      title: 'Game Rules & Basics',
      description: 'Essential strategies for slots, blackjack, roulette, poker, and live dealer games.',
      level: 'Beginner',
      readTime: 'July 2'
    }
  ];

  const advancedTopics = [
    {
      icon: TrendingUp,
      title: 'Advanced Gaming Strategies',
      description: 'Card counting, bankroll management, and probability calculations for experienced players.',
      level: 'Advanced',
      readTime: 'July 2'
    },
    {
      icon: Award,
      title: 'VIP Programs & Loyalty',
      description: 'Maximize rewards, understand tier systems, and leverage exclusive benefits.',
      level: 'Intermediate',
      readTime: 'July 2'
    },
    {
      icon: Users,
      title: 'Live Casino Etiquette',
      description: 'Proper behavior, tipping customs, and communication with live dealers.',
      level: 'Intermediate',
      readTime: 'July 2'
    }
  ];

  const responsibleGaming = [
    {
      icon: Heart,
      title: 'Responsible Gambling',
      description: 'Recognize warning signs, set healthy limits, and access support resources.',
      level: 'Essential',
      readTime: 'July 2'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Balance gaming with daily life and avoid excessive play sessions.',
      level: 'Essential',
      readTime: 'July 2'
    }
  ];

  const renderTopicSection = (title: string, topics: any[], bgColor: string) => (
    <div className="mb-12">
      <h4 className="text-xl font-bold text-white mb-6 text-center">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <Card key={index} className="bg-casino-card-bg border-casino-border-subtle hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                  <topic.icon className="w-6 h-6 text-casino-neon-green" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{topic.level}</div>
                  <div className="text-xs text-casino-neon-green">{topic.readTime} 2025</div>
                </div>
              </div>
              
              <h5 className="text-lg font-semibold text-white mb-3 group-hover:text-casino-neon-green transition-colors">
                {topic.title}
              </h5>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                {topic.description}
              </p>

              <div className="mt-4 pt-4 border-t border-casino-border-subtle">
                <span className="text-xs text-yellow-500">Writed by Moderator CGSG</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold mb-4">
          <span className="text-white">Comprehensive</span> <span className="gradient-text">Learning Topics</span>
        </h3>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          From beginner basics to advanced strategies, our upcoming guides will cover everything you need to know about online casino gaming.
        </p>
      </div>

      {renderTopicSection(
        "Beginner Essentials", 
        beginnerTopics, 
        "bg-casino-neon-green/20"
      )}

      {renderTopicSection(
        "Advanced Strategies", 
        advancedTopics, 
        "bg-casino-neon-purple/20"
      )}

      {renderTopicSection(
        "Responsible Gaming", 
        responsibleGaming, 
        "bg-red-500/20"
      )}

      {/* Statistics Preview */}
      <div className="bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5 border border-casino-neon-green/20 rounded-lg p-8 text-center">
        <h4 className="text-xl font-bold text-white mb-4">What to Expect</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-casino-neon-green mb-1">25+</div>
            <div className="text-gray-400 text-sm">Comprehensive Guides</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-casino-neon-green mb-1">50+</div>
            <div className="text-gray-400 text-sm">Quick Tips & Tricks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-casino-neon-green mb-1">100%</div>
            <div className="text-gray-400 text-sm">Expert Verified Content</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideTopics;
