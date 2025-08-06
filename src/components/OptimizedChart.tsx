'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { TrendingUp, BarChart3, Shield, Award } from 'lucide-react';

// Simple statistics without heavy chart library
const statisticsData = [
  {
    id: 1,
    title: 'Casinos Reviewed',
    value: '106',
    change: '+15',
    changeType: 'positive' as const,
    icon: Award,
    description: 'Total casinos reviewed and rated'
  },
  {
    id: 2,
    title: 'Active Members',
    value: '1,081',
    change: '+23',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: 'Community members this month'
  },
  {
    id: 3,
    title: 'Safety Index',
    value: '92%',
    change: '+5%',
    changeType: 'positive' as const,
    icon: Shield,
    description: 'Average safety rating'
  },
  {
    id: 4,
    title: 'Success Rate',
    value: '98%',
    change: '+2%',
    changeType: 'positive' as const,
    icon: BarChart3,
    description: 'User satisfaction rate'
  }
];

export default function OptimizedChart() {
  const [activeTab, setActiveTab] = useState<'stats' | 'safety'>('stats');

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Our <span className="text-casino-neon-green">Performance</span>
          </h2>
          <p className="text-casino-text-secondary max-w-2xl mx-auto">
            Track our review progress and community growth with real-time statistics and insights.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-casino-dark-card rounded-lg p-1 border border-casino-border-subtle">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-casino-neon-green text-casino-dark'
                  : 'text-casino-text-secondary hover:text-white'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'safety'
                  ? 'bg-casino-neon-green text-casino-dark'
                  : 'text-casino-text-secondary hover:text-white'
              }`}
            >
              Safety Ratings
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statisticsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.id}
                  className="bg-casino-dark-card border-casino-border-subtle p-6 hover:border-casino-neon-green/30 transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-casino-neon-green/20 flex items-center justify-center group-hover:bg-casino-neon-green/30 transition-colors">
                      <Icon className="w-6 h-6 text-casino-neon-green" />
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {stat.change}
                    </div>
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-casino-neon-green transition-colors">
                      {stat.value}
                    </h3>
                  </div>

                  {/* Title */}
                  <h4 className="text-casino-text-secondary font-medium mb-1">
                    {stat.title}
                  </h4>

                  {/* Description */}
                  <p className="text-casino-text-muted text-sm">
                    {stat.description}
                  </p>
                </Card>
              );
            })}
          </div>
        )}

        {/* Safety Ratings */}
        {activeTab === 'safety' && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-casino-dark-card border-casino-border-subtle p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Casino Safety Distribution
              </h3>
              
              <div className="space-y-4">
                {[
                  { rating: 'Very High', count: 10, percentage: 9, color: 'bg-green-500' },
                  { rating: 'High', count: 25, percentage: 24, color: 'bg-blue-500' },
                  { rating: 'Medium', count: 45, percentage: 42, color: 'bg-yellow-500' },
                  { rating: 'Low', count: 26, percentage: 25, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.rating} className="flex items-center space-x-4">
                    <div className="w-20 text-casino-text-secondary text-sm">
                      {item.rating}
                    </div>
                    <div className="flex-1 bg-casino-dark-lighter rounded-full h-6 relative overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-1000 rounded-full flex items-center justify-end pr-2`}
                        style={{ width: `${item.percentage}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 text-casino-text-secondary text-sm text-right">
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-casino-border-subtle text-center">
                <p className="text-casino-text-secondary text-sm">
                  <span className="text-casino-neon-green font-medium">68%</span> of reviewed casinos 
                  have High or Very High safety ratings
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-casino-dark-card rounded-xl p-8 border border-casino-border-subtle">
            <h3 className="text-xl font-bold text-white mb-4">
              Want to see detailed analytics?
            </h3>
            <p className="text-casino-text-secondary mb-6">
              Get access to comprehensive casino data, trends, and safety reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/reviews"
                className="inline-flex items-center justify-center px-6 py-3 bg-casino-neon-green text-casino-dark font-medium rounded-lg hover:bg-casino-neon-green-light transition-colors"
              >
                View All Reviews
              </a>
              <a
                href="/list-report"
                className="inline-flex items-center justify-center px-6 py-3 border border-casino-border-subtle text-casino-text-secondary hover:text-white hover:border-casino-neon-green/50 rounded-lg transition-colors"
              >
                Safety Reports
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}