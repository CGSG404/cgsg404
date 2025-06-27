
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Chart = () => {
  const reviewData = [
    { month: 'Jan', casinos: 0, reviews: 0 },
    { month: 'Feb', casinos: 0, reviews: 0 },
    { month: 'Mar', casinos: 0, reviews: 0 },
    { month: 'Apr', casinos: 20, reviews: 20 },
    { month: 'May', casinos: 91, reviews: 91 },
    { month: 'Jun', casinos: 106, reviews: 106 },
  ];

  const safetyData = [
    { rating: 'Very High', count: 10, color: '#10b981' },
    { rating: 'High', count: 10, color: '#3b82f6' },
    { rating: 'Medium', count: 129, color: '#f59e0b' },
    { rating: 'Low', count: 203, color: '#ef4444' },
  ];

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
                  dataKey="month" 
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
                  dataKey="casinos" 
                  stroke="#00ff99" 
                  strokeWidth={3}
                  dot={{ fill: '#00ff99', strokeWidth: 2, r: 4 }}
                  name="New Casinos"
                />
                <Line 
                  isAnimationActive={false}
                  type="monotone" 
                  dataKey="reviews" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="Total Reviews"
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
                  dataKey="rating" 
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
                  dataKey="count" 
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
