import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';

const StatsGrid = () => {
  const stats = [
    {
      title: 'New Casinos This Month',
      value: '1',
      change: '-10%',
      isPositive: false,
      description: 'Newly reviewed platforms'
    },
    {
      title: 'Active Bonuses',
      value: '1,283',
      change: '+8%',
      isPositive: true,
      description: 'Currently available offers'
    },
    {
      title: 'Safety Warnings',
      value: '23',
      change: '-15%',
      isPositive: true,
      description: 'Casinos flagged this week'
    },
    {
      title: 'User Reviews',
      value: '15,429',
      change: '+24%',
      isPositive: true,
      description: 'Community feedback'
    },
    {
      title: 'Expert Ratings',
      value: '2,847',
      change: '+6%',
      isPositive: true,
      description: 'Professional evaluations'
    },
    {
      title: 'Resolved Complaints',
      value: '156',
      change: '+18%',
      isPositive: true,
      description: 'Successfully mediated'
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Platform <span className="gradient-text">Statistics</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time data about our casino reviews, community activity, and platform health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-casino-card-bg border-casino-border-subtle p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    <CountUp
                      end={parseInt(stat.value.replace(/,/g, ''))}
                      duration={1.5}
                      separator=","
                    />
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-500 text-sm">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;
