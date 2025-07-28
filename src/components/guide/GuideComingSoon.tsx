import { Card, CardContent } from '@/src/components/ui/card';
import { BookOpen, Shield, Target, Gift, Heart } from 'lucide-react';

const GuideComingSoon = () => {
  const quickTips = [
    {
      icon: Shield,
      title: "Choose Licensed Casinos",
      tip: "Always verify the casino has a valid gambling license from reputable authorities like MGA, UKGC, or Curacao."
    },
    {
      icon: Gift,
      title: "Read Bonus Terms",
      tip: "Check wagering requirements, game restrictions, and maximum bet limits before claiming any bonus."
    },
    {
      icon: Target,
      title: "Set Your Limits",
      tip: "Establish deposit and time limits before you start playing to maintain responsible gambling habits."
    },
    {
      icon: Heart,
      title: "Play for Fun",
      tip: "Remember that gambling should be entertaining. Never chase losses or bet money you can't afford to lose."
    }
  ];

  return (
    <div className="mb-16">
      <Card className="bg-casino-card-bg/40 border-casino-neon-green/30 max-w-4xl mx-auto mb-12">
        <CardContent className="p-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-casino-neon-green rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-casino-dark" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-white">Casino</span> <span className="gradient-text">Learning Center</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
            Comprehensive guides and tutorials are coming soon. In the meantime, here are some essential tips:
          </p>
        </CardContent>
      </Card>

      {/* Quick Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {quickTips.map((tip, index) => (
          <Card key={index} className="bg-casino-card-bg border-casino-border-subtle hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-casino-neon-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-6 h-6 text-casino-neon-green" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{tip.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GuideComingSoon;
