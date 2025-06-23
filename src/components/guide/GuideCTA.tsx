
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Clock } from 'lucide-react';

const GuideCTA = () => {
  return (
    <div className="text-center">
      <Card className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-green/5 border-casino-neon-green/30 max-w-3xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bell className="w-6 h-6 text-casino-neon-green" />
            <h3 className="text-2xl font-bold text-white">
              Stay Tuned
            </h3>
          </div>
          
          <p className="text-gray-300 mb-6 text-lg">
            New guides launching very soon!
          </p>
          
          <div className="flex items-center gap-2 justify-center mb-6 text-casino-neon-green">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Coming Soon</span>
          </div>
          
          <Button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold px-8 py-3 text-lg">
            Get Notified
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuideCTA;
