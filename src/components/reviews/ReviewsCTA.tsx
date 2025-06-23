
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Filter, Award } from 'lucide-react';

const ReviewsCTA = () => {
  return (
    <div className="mt-16 text-center">
      <Card className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-green/5 border-casino-neon-green/30 max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-6 h-6 text-casino-neon-green" />
            <h3 className="text-2xl font-bold text-white">
              Looking for the Best Recommendations?
            </h3>
          </div>
          
          <p className="text-gray-300 mb-6 text-lg">
            Use our smart filters to find the top-rated casinos with the best bonuses and most trusted platforms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Smart Filtering</span>
            </div>
            <div className="flex items-center gap-2 text-casino-neon-green">
              <Award className="w-4 h-4" />
              <span className="text-sm">Top Rated Only</span>
            </div>
          </div>
          
          <Button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-8 py-3 text-lg">
            Find My Perfect Casino
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsCTA;
