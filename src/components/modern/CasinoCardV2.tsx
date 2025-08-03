'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Shield, 
  Gift, 
  ExternalLink, 
  AlertTriangle, 
  Zap,
  Award,
  Clock,
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent } from '@/src/components/ui/card';

// Types
interface CasinoV2 {
  id: number;
  name: string;
  slug: string;
  logo: string;
  rating: number;
  safetyIndex: 'Very High' | 'High' | 'Medium' | 'Low';
  bonus: string;
  description: string;
  playUrl: string;
  isNew?: boolean;
  isHot?: boolean;
  isFeatured?: boolean;
  features: string[];
  badges: string[];
  links: {
    bonus: string;
    review: string;
    complaint: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CasinoCardV2Props {
  casino: CasinoV2;
  onFavorite?: (casinoId: number) => void;
  onShare?: (casino: CasinoV2) => void;
  isFavorited?: boolean;
  priority?: boolean;
}

// Utility functions
const getSafetyConfig = (index: string) => {
  const configs = {
    'Very High': {
      color: 'bg-emerald-500 text-white border-emerald-400',
      glow: 'shadow-emerald-500/20',
      icon: '🛡️'
    },
    'High': {
      color: 'bg-blue-500 text-white border-blue-400',
      glow: 'shadow-blue-500/20',
      icon: '🔒'
    },
    'Medium': {
      color: 'bg-amber-500 text-black border-amber-400',
      glow: 'shadow-amber-500/20',
      icon: '⚠️'
    },
    'Low': {
      color: 'bg-red-500 text-white border-red-400',
      glow: 'shadow-red-500/20',
      icon: '🚨'
    }
  };
  return configs[index as keyof typeof configs] || configs.Medium;
};

const formatRating = (rating: number) => {
  return Math.round(rating * 10) / 10;
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Main component
const CasinoCardV2: React.FC<CasinoCardV2Props> = ({
  casino,
  onFavorite,
  onShare,
  isFavorited = false,
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [bonusExpanded, setBonusExpanded] = useState(false);

  const safetyConfig = getSafetyConfig(casino.safetyIndex);
  const formattedRating = formatRating(casino.rating);

  const handlePlayNow = (e: React.MouseEvent) => {
    e.preventDefault();
    // Track click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'casino_play_click', {
        casino_name: casino.name,
        casino_id: casino.id
      });
    }
    window.open(casino.playUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBonusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setBonusExpanded(!bonusExpanded);
    if (!bonusExpanded) {
      // Track bonus view
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'casino_bonus_view', {
          casino_name: casino.name,
          casino_id: casino.id
        });
      }
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(casino.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(casino);
  };

  return (
    <Card 
      className={`
        group relative overflow-hidden transition-all duration-300 ease-out
        bg-gradient-to-br from-slate-900/95 to-slate-800/95 
        border border-slate-700/50 hover:border-casino-neon-green/50
        hover:shadow-xl hover:shadow-casino-neon-green/10
        ${isHovered ? 'scale-[1.02]' : 'scale-100'}
        ${casino.isFeatured ? 'ring-2 ring-casino-neon-green/30' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {casino.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-to-r from-casino-neon-green to-emerald-400 text-casino-dark font-bold text-xs px-2 py-1">
            <Award className="w-3 h-3 mr-1" />
            FEATURED
          </Badge>
        </div>
      )}

      {/* Status Badges */}
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        {casino.isNew && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs animate-pulse">
            NEW
          </Badge>
        )}
        {casino.isHot && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs">
            <Zap className="w-3 h-3 mr-1" />
            HOT
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
          onClick={handleShare}
          aria-label="Share casino"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4 mb-4">
            {/* Logo */}
            <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
              {!imageError ? (
                <Image
                  src={casino.logo}
                  alt={`${casino.name} logo`}
                  fill
                  className="object-contain p-2"
                  onError={() => setImageError(true)}
                  priority={priority}
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold text-lg">
                  {casino.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Casino Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white truncate group-hover:text-casino-neon-green transition-colors">
                  {casino.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const diff = formattedRating - i;
                    return (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          diff >= 1
                            ? 'text-yellow-400 fill-yellow-400'
                            : diff >= 0.5
                            ? 'text-yellow-400 fill-yellow-400/50'
                            : 'text-slate-600'
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-slate-300 text-sm font-medium">
                  {formattedRating}/5
                </span>
              </div>

              {/* Safety Index */}
              <Badge className={`${safetyConfig.color} border font-semibold text-xs`}>
                <Shield className="w-3 h-3 mr-1" />
                {casino.safetyIndex}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {truncateText(casino.description, 120)}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {casino.features.slice(0, 3).map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-slate-800 text-slate-300 border-slate-600 text-xs"
              >
                {feature}
              </Badge>
            ))}
            {casino.features.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-400 border-slate-600 text-xs"
              >
                +{casino.features.length - 3} more
              </Badge>
            )}
          </div>

          {/* Casino Badges */}
          {casino.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {casino.badges.map((badge, index) => (
                <Badge
                  key={index}
                  className="bg-casino-neon-green/20 text-casino-neon-green border border-casino-neon-green/30 text-xs"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bonus Section */}
        <div className="px-6 pb-4">
          <div
            className={`
              bg-gradient-to-r from-casino-neon-green/10 to-emerald-500/10 
              border rounded-xl p-4 cursor-pointer transition-all duration-200
              ${bonusExpanded 
                ? 'border-casino-neon-green/70 shadow-lg shadow-casino-neon-green/20' 
                : 'border-casino-neon-green/30 hover:border-casino-neon-green/50'
              }
            `}
            onClick={handleBonusClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-casino-neon-green" />
                <span className="font-semibold text-sm text-casino-neon-green">
                  Welcome Bonus
                </span>
              </div>
              <ChevronRight 
                className={`w-4 h-4 text-casino-neon-green transition-transform duration-200 ${
                  bonusExpanded ? 'rotate-90' : ''
                }`} 
              />
            </div>
            <p className="text-white font-bold mt-2">
              {casino.bonus}
            </p>
            
            {bonusExpanded && (
              <div className="mt-4 pt-4 border-t border-casino-neon-green/20">
                <div className="text-xs text-slate-300 space-y-1">
                  <p>• 18+ only. New players only.</p>
                  <p>• Minimum deposit may be required.</p>
                  <p>• Wagering requirements apply.</p>
                  <p>• Terms and conditions apply.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {/* Primary CTA */}
            <Button
              onClick={handlePlayNow}
              className="w-full bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-bold text-lg py-3 h-12 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                Play Now
                <ExternalLink className="w-5 h-5" />
              </span>
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href={casino.links.review} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
                >
                  Read Review
                </Button>
              </Link>
              <Link href={casino.links.complaint} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-500/10 text-xs"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated {new Date(casino.updatedAt).toLocaleDateString()}</span>
            </div>
            <span>ID: {casino.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CasinoCardV2;