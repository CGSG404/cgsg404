import { createContext, useContext, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Gift, ExternalLink, AlertTriangle, X } from 'lucide-react';
import ReportDialog from './ReportDialog';

// Context untuk mengelola state modal bonus
type BonusModalContextType = {
  openModal: (casinoId: number, bonus: string, bonusUrl: string) => void;
  closeModal: () => void;
  currentCasino: { id: number | null; bonus: string; bonusUrl: string } | null;
};

const BonusModalContext = createContext<BonusModalContextType | undefined>(undefined);

// Provider untuk context modal bonus
export const BonusModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentCasino, setCurrentCasino] = useState<{ id: number | null; bonus: string; bonusUrl: string } | null>(null);

  const openModal = useCallback((casinoId: number, bonus: string, bonusUrl: string) => {
    setCurrentCasino({ id: casinoId, bonus, bonusUrl });
  }, []);

  const closeModal = useCallback(() => {
    setCurrentCasino(null);
  }, []);

  return (
    <BonusModalContext.Provider value={{ openModal, closeModal, currentCasino }}>
      {children}
    </BonusModalContext.Provider>
  );
};

// Hook untuk menggunakan context modal bonus
const useBonusModal = () => {
  const context = useContext(BonusModalContext);
  if (!context) {
    throw new Error('useBonusModal must be used within a BonusModalProvider');
  }
  return context;
};

// Komponen Modal Bonus
const BonusModal = () => {
  const { currentCasino, closeModal } = useBonusModal();
  
  if (!currentCasino) return null;

  const handleClaimBonus = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(currentCasino.bonusUrl, '_blank');
    closeModal();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" 
      onClick={closeModal}
    >
      <div 
        className="bg-casino-card-bg border border-casino-neon-green/50 rounded-lg p-6 max-w-md w-full relative" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-casino-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6 text-casino-neon-green" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Bonus Details</h3>
          <p className="text-gray-300">{currentCasino.bonus}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-casino-dark-lighter/50 p-4 rounded-lg">
            <h4 className="font-semibold text-casino-neon-green mb-2">Bonus Terms</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="text-casino-neon-green mr-2">•</span>
                <span>18+ only. New players only.</span>
              </li>
              <li className="flex items-start">
                <span className="text-casino-neon-green mr-2">•</span>
                <span>Minimum deposit may be required.</span>
              </li>
              <li className="flex items-start">
                <span className="text-casino-neon-green mr-2">•</span>
                <span>Wagering requirements apply.</span>
              </li>
            </ul>
          </div>
          
          <Button 
            className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-bold"
            onClick={handleClaimBonus}
          >
            Claim Bonus Now
          </Button>
        </div>
      </div>
    </div>
  );
};

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

// Komponen BonusCard yang reusable
const BonusCard = ({ bonus, onClose, onClaim }: { bonus: string; onClose: () => void; onClaim: (e: React.MouseEvent) => void }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-casino-card-bg border border-casino-neon-green/50 rounded-lg p-6 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-casino-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-6 h-6 text-casino-neon-green" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Bonus Details</h3>
        <p className="text-gray-300">{bonus}</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-casino-dark-lighter/50 p-4 rounded-lg">
          <h4 className="font-semibold text-casino-neon-green mb-2">Bonus Terms</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-casino-neon-green mr-2">•</span>
              <span>18+ only. New players only.</span>
            </li>
            <li className="flex items-start">
              <span className="text-casino-neon-green mr-2">•</span>
              <span>Minimum deposit may be required.</span>
            </li>
            <li className="flex items-start">
              <span className="text-casino-neon-green mr-2">•</span>
              <span>Wagering requirements apply.</span>
            </li>
          </ul>
        </div>
        
        <Button 
          className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-bold"
          onClick={onClaim}
        >
          Claim Bonus Now
        </Button>
      </div>
    </div>
  </div>
);

interface CasinoCardState {
  reportDialogOpen: boolean;
}

const CasinoCard = ({ casino }: CasinoCardProps) => {
  const { openModal, currentCasino, closeModal } = useBonusModal();
  const [state, setState] = useState<CasinoCardState>({
    reportDialogOpen: false
  });
  
  const isCurrentCasino = currentCasino?.id === casino.id;
  
  const openReportDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => ({ ...prev, reportDialogOpen: true }));
  };
  
  const closeReportDialog = () => {
    setState(prev => ({ ...prev, reportDialogOpen: false }));
  };
  
  const handleBonusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentCasino) {
      // Jika mengklik card yang sama, tutup modal
      openModal(-1, '', '');
    } else {
      // Buka modal untuk card ini
      openModal(casino.id, casino.bonus, casino.links.bonus);
    }
  };
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
        <div className="flex flex-wrap items-start justify-between gap-y-2 mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              <img 
                src={casino.logo} 
                alt={casino.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzBmMTUyYSIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDBmZjk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-1">
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
                        i < Math.round(casino.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
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
        <div 
          className={`bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-purple/10 border rounded-lg p-3 mb-4 cursor-pointer transition-all duration-200 ${
            isCurrentCasino 
              ? 'border-casino-neon-green/70 shadow-lg shadow-casino-neon-green/20' 
              : 'border-casino-neon-green/30 hover:border-casino-neon-green/50'
          }`}
          onClick={handleBonusClick}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-2">
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-casino-neon-green" />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="font-semibold text-sm text-casino-neon-green">{casino.bonus}</span>
            </div>
          </div>
        </div>
        
        {/* Bonus Modal - Rendered once in the app */}

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
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={`border-casino-neon-green/50 text-casino-neon-green hover:bg-casino-neon-green/10 text-xs transition-all duration-200 ${
                isCurrentCasino ? 'bg-casino-neon-green/20 border-casino-neon-green' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isCurrentCasino) {
                  closeModal();
                } else {
                  openModal(casino.id, casino.bonus, casino.links.bonus);
                }
              }}
            >
              <Gift className="w-3 h-3 mr-1" />
              {isCurrentCasino ? 'Hide Bonus' : 'Show Bonus'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs transition-all duration-200"
              onClick={openReportDialog}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Report
            </Button>
          </div>
          {/* Bonus Details - Show when this card's bonus is active */}
          {isCurrentCasino && (
            <div className="mt-4 p-4 bg-casino-dark-lighter/30 rounded-lg border border-casino-neon-green/30 animate-fadeIn">
              <h4 className="text-casino-neon-green font-semibold mb-2">Bonus Details</h4>
              <p className="text-gray-300 text-sm mb-3">{casino.bonus}</p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(casino.links.bonus, '_blank');
                }}
                className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold"
              >
                Claim Bonus Now
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Dialog */}
      <ReportDialog 
        open={state.reportDialogOpen}
        onOpenChange={closeReportDialog}
        casinoName={casino.name}
      />
    </Card>
  );
};

// Komponen wrapper untuk menyediakan context
const CasinoCardWithProvider = (props: CasinoCardProps) => (
  <BonusModalProvider>
    <BonusModal />
    <CasinoCard {...props} />
  </BonusModalProvider>
);

export default CasinoCardWithProvider;
