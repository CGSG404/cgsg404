import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Gift, AlertTriangle, ExternalLink } from 'lucide-react';
import { LinkButton } from '@/components/ui/LinkButton';
import ReportDialog from './ReportDialog';

interface Casino {
  id: number;
  name: string;
  logo: string;
  rating: number;
  safetyIndex: 'Very High' | 'High' | 'Medium' | 'Low';
  bonus: string;
  features: string[];
  description: string;
  badges: string[];
  isNew?: boolean;
  isHot?: boolean;
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
}

interface CasinoCardProps {
  casino: Casino;
}

const ReportCasinoCard = ({ casino }: CasinoCardProps) => {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const getSafetyColor = (index: string) => {
    switch (index) {
      case 'Very High': return 'text-green-400';
      case 'High': return 'text-blue-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSafetyBgColor = (index: string) => {
    switch (index) {
      case 'Very High': return 'bg-green-400/10';
      case 'High': return 'bg-blue-400/10';
      case 'Medium': return 'bg-yellow-400/10';
      case 'Low': return 'bg-red-400/10';
      default: return 'bg-gray-400/10';
    }
  };

  return (
    <>
      <Card className="bg-casino-card-bg border-casino-border-subtle card-hover overflow-hidden">
        <CardContent className="p-6">
          {/* Header with Logo and Badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={casino.logo} 
                alt={casino.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{casino.name}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(casino.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                  <span className="text-gray-400 text-sm ml-1">({casino.rating})</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {casino.badges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className={`text-xs ${
                    casino.isNew && badge === 'New' ? 'bg-casino-neon-green text-casino-dark' :
                    casino.isHot && badge === 'Hot' ? 'bg-red-500 text-white' :
                    'bg-casino-neon-purple/20 text-casino-neon-purple'
                  }`}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Safety Index */}
          <div className="flex items-center space-x-2 mb-3">
            <Shield className={`w-4 h-4 ${getSafetyColor(casino.safetyIndex)}`} />
            <span className="text-sm text-gray-400">Safety Index:</span>
            <Badge className={`${getSafetyBgColor(casino.safetyIndex)} ${getSafetyColor(casino.safetyIndex)} border-0`}>
              {casino.safetyIndex}
            </Badge>
          </div>

          {/* Bonus */}
          <div className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-purple/10 border border-casino-neon-green/30 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <Gift className="w-4 h-4 text-casino-neon-green" />
              <span className="text-sm font-medium text-casino-neon-green">Welcome Bonus</span>
            </div>
            <p className="text-white font-semibold">{casino.bonus}</p>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {casino.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {casino.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="bg-casino-dark border border-casino-border-subtle rounded-full px-3 py-1 text-xs text-gray-300"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button className="bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold">
              <Gift className="w-4 h-4 mr-2" />
              Get Bonus
            </Button>
            <Button variant="outline" className="border-casino-neon-green/50 text-casino-neon-green hover:bg-casino-neon-green/10">
              Read Review
            </Button>
          </div>

          {/* Report Issue Button */}
          <div className="flex justify-start items-center text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportDialogOpen(true)}
              className="text-gray-400 hover:text-casino-neon-green p-0 h-auto"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Report Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        casinoName={casino.name}
      />
    </>
  );
};

export default ReportCasinoCard;
