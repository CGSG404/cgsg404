
'use client';

import { Card } from '@/src/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchChartData, fallbackChartData } from '@/src/lib/homepage-data';

const Chart = () => {
  const { data: chartData = fallbackChartData } = useQuery({
    queryKey: ['chartData'],
    queryFn: fetchChartData,
    initialData: fallbackChartData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const reviewData = chartData.filter(item => item.chart_type === 'review');
  const safetyData = chartData.filter(item => item.chart_type === 'safety');

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Review <span className="gradient-text">Analytics</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track our review progress and safety ratings distribution across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Casino Reviews Over Time */}
          <Card className="bg-casino-card-bg border-casino-border-subtle p-6">
            <h3 className="text-xl font-bold text-white mb-6">Casino Reviews Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
                <XAxis 
                  dataKey="label" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1f2e', 
                    border: '1px solid #2a3441',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Line 
                  isAnimationActive={false}
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00ff99" 
                  strokeWidth={3}
                  dot={{ fill: '#00ff99', strokeWidth: 2, r: 4 }}
                  name="New Casinos"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Safety Index Distribution */}
          <Card className="bg-casino-card-bg border-casino-border-subtle p-6">
            <h3 className="text-xl font-bold text-white mb-6">Safety Index Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safetyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
                <XAxis 
                  dataKey="label" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1f2e', 
                    border: '1px solid #2a3441',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  isAnimationActive={false}
                  dataKey="value" 
                  fill="#00ff99"
                  radius={[4, 4, 0, 0]}
                  name="Casinos"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Chart;
