import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Gift, ExternalLink, FileText, AlertTriangle } from 'lucide-react';

interface CasinoCardProps {
  casino: {
    id: number;
    name: string;
    logo: string;
    rating: number;
    safetyIndex: 'Low' | 'Medium' | 'High' | 'Very High';
    bonus: string;
    features: string[];
    description: string;
    badges?: string[];
    isNew?: boolean;
    links: {
      bonus: string;
      review: string;
      complaint: string;
    };
    playUrl: string;
  };
}

const CasinoCard = ({ casino }: CasinoCardProps) => {
  const getSafetyColor = (index: string) => {
    switch (index) {
      case 'Very High': return 'bg-green-500 text-white border-green-400';
      case 'High': return 'bg-blue-500 text-white border-blue-400';
      case 'Medium': return 'bg-yellow-500 text-black border-yellow-400';
      case 'Low': return 'bg-red-500 text-white border-red-400';
      default: return 'bg-gray-500 text-white border-gray-400';
    }
  };

  const getSafetyGlow = (index: string) => {
    switch (index) {
      case 'Very High': return 'shadow-[0_0_20px_rgba(34,197,94,0.3)]';
      case 'High': return 'shadow-[0_0_20px_rgba(59,130,246,0.3)]';
      case 'Medium': return 'shadow-[0_0_20px_rgba(234,179,8,0.3)]';
      case 'Low': return 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      default: return '';
    }
  };

  return (
    <Card className={`bg-casino-card-bg border-casino-border-subtle overflow-hidden transition-all duration-300 hover:scale-105 hover:${getSafetyGlow(casino.safetyIndex)} group cursor-pointer`}>
      <div className="p-6">
        {/* Header with Logo and Basic Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <img 
                src={casino.logo} 
                alt={casino.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzBmMTUyYSIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDBmZjk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white truncate">{casino.name}</h3>
                {casino.isNew && (
                  <Badge className="bg-casino-neon-green text-casino-dark text-xs font-bold animate-pulse">
                    NEW
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < casino.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({casino.rating}/5)</span>
              </div>
            </div>
          </div>
          
          {/* Safety Index Badge */}
          <Badge className={`${getSafetyColor(casino.safetyIndex)} border font-semibold`}>
            <Shield className="w-3 h-3 mr-1" />
            {casino.safetyIndex}
          </Badge>
        </div>

        {/* Casino Badges */}
        {casino.badges && casino.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {casino.badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-casino-dark-lighter text-casino-neon-green border border-casino-neon-green/30 text-xs"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Bonus Offer */}
        <div className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-purple/10 border border-casino-neon-green/30 rounded-lg p-3 mb-4">
          <div className="flex items-start text-casino-neon-green">
            <Gift className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="font-semibold text-sm leading-tight">{casino.bonus}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">{casino.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {casino.features.slice(0, 3).map((feature, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-casino-dark-lighter text-gray-300 text-xs border border-casino-border-subtle"
            >
              {feature}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action */}
          <a
            href={casino.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-casino-neon-green text-casino-dark font-bold text-lg py-3 hover:bg-casino-neon-green/90 transition">
              <span className="flex items-center justify-center gap-2">
                <span>Play Now</span>
                <ExternalLink className="w-4 h-4" />
              </span>
            </Button>
          </a>
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-casino-neon-green/50 text-casino-neon-green hover:bg-casino-neon-green/10 text-xs transition-all duration-200"
              onClick={() => window.open(casino.links.bonus, '_blank')}
            >
              <Gift className="w-3 h-3 mr-1" />
              Bonus
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-xs transition-all duration-200"
              onClick={() => window.open(casino.links.review, '_blank')}
            >
              <FileText className="w-3 h-3 mr-1" />
              Review
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs transition-all duration-200"
              onClick={() => window.open(casino.links.complaint, '_blank')}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CasinoCard;
