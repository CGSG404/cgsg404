import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Users, Gift, Award } from 'lucide-react';
import CountUp from 'react-countup';

const HeroSection = () => {
  const stats = [
    { icon: Shield, value: '1+', label: 'Casinos Reviewed', color: 'text-casino-neon-green' },
    { icon: Users, value: '1+', label: 'Community Members', color: 'text-blue-400' },
    { icon: Gift, value: '1+', label: 'Bonus Offers', color: 'text-casino-neon-purple' },
    { icon: Award, value: '1%', label: 'Trust Score', color: 'text-yellow-400' },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-casino-neon-green/5 to-casino-neon-purple/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-casino-neon-green/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-casino-neon-purple/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Trusted
            <span className="gradient-text block">Casino Guide</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Find the best online casinos, Live Reports, read honest reviews, 
            and discover safe gambling platforms recommended by experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-8 py-3 text-lg neon-border"
            >
              Find Best Casinos
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-casino-neon-green/50 text-casino-neon-green hover:bg-casino-neon-green/10 font-semibold px-8 py-3 text-lg"
            >
              Read Reviews
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-casino-card-bg border-casino-border-subtle p-6 text-center card-hover">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-3xl font-bold mb-2 text-white">
                <CountUp
                  end={parseFloat(stat.value.replace(/[,+]/g, ''))}
                  duration={1.5}
                  separator=","
                  decimals={stat.value.includes('.') ? 1 : 0}
                />
                {stat.value.match(/[+%]$/) ? stat.value.match(/[+%]$/)[0] : ''}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
