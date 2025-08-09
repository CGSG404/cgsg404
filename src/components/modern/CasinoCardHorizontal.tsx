'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Star,
  Shield,
  ExternalLink,
  Gift,
  MessageCircle,
  AlertTriangle,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Headphones,
  CreditCard,
  Flag,
  Loader2
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { supabase } from '@/src/lib/supabaseClient';
import { toast } from 'sonner';
import { sanitizeInput, sanitizeUrl, validateReportData } from '@/src/lib/security';

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

interface CasinoCardHorizontalProps {
  casino: CasinoV2;
  onFavorite?: (casinoId: number) => void;
  onShare?: (casino: CasinoV2) => void;
  isFavorited?: boolean;
  priority?: boolean;
  index?: number;
}

const CasinoCardHorizontal: React.FC<CasinoCardHorizontalProps> = ({
  casino,
  onFavorite,
  onShare,
  isFavorited = false,
  priority = false,
  index = 0
}) => {
  const [reportStatus, setReportStatus] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getSafetyColor = (safetyIndex: string) => {
    switch (safetyIndex) {
      case 'Very High': return 'bg-emerald-500 text-white';
      case 'High': return 'bg-blue-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSafetyScore = (safetyIndex: string) => {
    switch (safetyIndex) {
      case 'Very High': return '9.2';
      case 'High': return '8.5';
      case 'Medium': return '7.1';
      case 'Low': return '5.8';
      default: return '6.0';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-400/50 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('live')) return <Headphones className="w-3 h-3" />;
    if (feature.toLowerCase().includes('payment')) return <CreditCard className="w-3 h-3" />;
    if (feature.toLowerCase().includes('service')) return <MessageCircle className="w-3 h-3" />;
    if (feature.toLowerCase().includes('crypto')) return <CreditCard className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  const getGameIcon = (game: string) => {
    if (game.toLowerCase().includes('slot')) return 'Slot';
    if (game.toLowerCase().includes('live')) return 'Live';
    if (game.toLowerCase().includes('sport')) return 'Sport';
    if (game.toLowerCase().includes('arcade')) return 'Arcade';
    return 'Game';
  };

  // Helper function to get auth headers
  const getAuthHeaders = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.access_token) {
        throw new Error('No valid session found');
      }

      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw new Error('Authentication failed');
    }
  };

  const handleReportSubmit = async () => {
    if (!reportStatus || !reportSummary.trim()) {
      toast.error('Please select a status and provide a summary');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate and sanitize input data
      const reportData = {
        casino_name: casino.name,
        status: reportStatus,
        summary: reportSummary,
        url: casino.links.review || '#',
        last_reported: new Date().toISOString().split('T')[0]
      };

      const validation = validateReportData(reportData);
      
      if (!validation.isValid) {
        toast.error(`Validation failed: ${validation.errors?.join(', ')}`);
        return;
      }

      // Get auth headers
      const headers = await getAuthHeaders();
      
      // Submit sanitized data to existing admin casino reports API
      const response = await fetch('/api/admin/casino-reports', {
        method: 'POST',
        headers,
        body: JSON.stringify(validation.sanitizedData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Reset form
        setReportStatus('');
        setReportSummary('');
        setIsReportDialogOpen(false);
        
        toast.success('Report submitted successfully');
      } else {
        throw new Error(result.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex">
        {/* Left Section - Casino Logo Only (Full Focus) */}
        <div className="w-64 p-8 flex flex-col items-center justify-center border-r border-gray-700 relative" style={{backgroundColor: casino.logo.includes('top1') ? '#000000' : casino.logo.includes('bk88') ? '#1a365d' : casino.logo.includes('speed') ? '#ffffff' : casino.logo.includes('tokyo') ? '#000000' : casino.logo.includes('ducky') ? '#ffffff' : '#1f2937'}}>
          {/* Position Badge */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {index + 1}
          </div>
          
          {/* Large Casino Logo - No Border, Background Matching */}
          <div className="relative">
            <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
              <Image
                src={casino.logo}
                alt={`${casino.name} logo`}
                width={120}
                height={120}
                className="object-contain"
                priority={priority}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/casino-logos/default-casino.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Middle Section - Details with Casino Title & Safety Index */}
        <div className="flex-1 p-6 bg-gray-900">
          {/* Casino Title */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {sanitizeInput(casino.name)}
            </h3>
          </div>

          {/* Safety Index */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Safety Index */}
              <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">SAFETY INDEX:</span>
                <span className="text-xl font-bold text-white">{getSafetyScore(casino.safetyIndex)}</span>
                <Badge className={`${getSafetyColor(casino.safetyIndex)} text-xs px-2 py-1`}>
                  {casino.safetyIndex.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onFavorite?.(casino.id)}
                className="w-8 h-8 p-0 hover:bg-gray-700"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShare?.(casino)}
                className="w-8 h-8 p-0 hover:bg-gray-700"
              >
                <Share2 className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Rating & Badges */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(casino.rating)}
              </div>
              <span className="text-sm font-medium text-white">
                {casino.rating}/5
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2">
              {casino.isFeatured && (
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  FEATURED
                </Badge>
              )}
              {casino.isNew && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  NEW
                </Badge>
              )}
              {casino.isHot && (
                <Badge className="bg-red-100 text-red-800 text-xs">
                  HOT
                </Badge>
              )}
            </div>
          </div>

          {/* Casino Type & Features */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">International casino</span>
            </div>
            
            {/* Features List */}
            <div className="space-y-1">
              {casino.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
              
              {/* Additional features as dots */}
              {casino.features.length > 3 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">
                    +{casino.features.length - 3} more features
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bonus Section */}
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">BONUS:</span>
            </div>
            <p className="text-green-200 font-bold text-lg">
              {sanitizeInput(casino.bonus)}
            </p>
            <p className="text-xs text-green-400 mt-1">*T&Cs apply</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <a href={sanitizeUrl(casino.playUrl)} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Visit Casino
              </a>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <a href={sanitizeUrl(casino.links.review)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                Read Review
              </a>
            </Button>

            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Report Issue with {sanitizeInput(casino.name)}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="report-status">Report Status</Label>
                    <Select value={reportStatus} onValueChange={setReportStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unlicensed">Unlicensed</SelectItem>
                        <SelectItem value="Scam Indicated">Scam Indicated</SelectItem>
                        <SelectItem value="Many Users Reported">Many Users Reported</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="report-summary">Summary</Label>
                    <Textarea
                      id="report-summary"
                      placeholder="Please describe the issues with this casino..."
                      value={reportSummary}
                      onChange={(e) => setReportSummary(sanitizeInput(e.target.value))}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsReportDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReportSubmit}
                    disabled={!reportStatus || !reportSummary.trim() || isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Right Section - Language & Games */}
        <div className="w-64 bg-gray-800 p-6 border-l border-gray-700">
          {/* Language Options */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Language Options
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">Website: 51 languages</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">Live chat: 6 languages</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Headphones className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">Customer support: 6 languages</span>
              </div>
            </div>
          </div>

          {/* Available Games */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Available Games
              </h4>
              <Button variant="link" className="text-blue-400 text-xs p-0 h-auto">
                Show all
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {casino.badges.slice(0, 6).map((game, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-700 rounded border border-gray-600 text-xs">
                  <span>{getGameIcon(game)}</span>
                  <span className="text-gray-300 truncate">{game.replace(/Games?/i, '').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                Payment Methods
              </h4>
              <Button variant="link" className="text-blue-400 text-xs p-0 h-auto">
                Show all (81)
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {/* Mock payment methods */}
              {['Card', 'Cash', 'Bank', 'BTC', 'Gem', 'Target', 'Fast', 'Lock'].map((icon, idx) => (
                <div key={idx} className="w-10 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center text-sm">
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoCardHorizontal;