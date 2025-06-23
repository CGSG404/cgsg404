import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Shield, Gift, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  casino: {
    id: number;
    name: string;
    logo: string;
    rating: number;
    userScore: number;
    security: string;
    bonus: string;
    quickReview: string;
    pros: string[];
    cons: string[];
    reviewUrl: string;
  };
}

const ReviewCard = ({ casino }: ReviewCardProps) => {
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fungsi kirim rating ke backend
  const submitRating = async (rating: number) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const res = await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          casinoId: casino.id,
          rating,
          // userId: ... (jika ada sistem user)
        }),
      });
      if (res.ok) {
        setSubmitMessage('Thank you for your rating!');
      } else {
        setSubmitMessage('Failed to submit rating.');
      }
    } catch {
      setSubmitMessage('Failed to submit rating.');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-casino-card-bg border-casino-border-subtle overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,255,153,0.1)]">
      <CardContent className="p-6">
        {/* Header */}
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
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{casino.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(casino.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({casino.rating}/5)</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-casino-neon-green font-bold text-lg">{casino.userScore}/10</div>
            <div className="text-gray-400 text-xs">User Score</div>
          </div>
        </div>

        {/* Security & Bonus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-casino-neon-green" />
            <span className="text-gray-300 text-sm">{casino.security}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-casino-neon-green" />
            <span className="text-gray-300 text-sm">{casino.bonus}</span>
          </div>
        </div>

        {/* Quick Review */}
        <div className="bg-gradient-to-r from-casino-neon-green/10 to-casino-neon-purple/10 border border-casino-neon-green/30 rounded-lg p-3 mb-4">
          <p className="text-gray-300 text-sm italic">"{casino.quickReview}"</p>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm">Pros</span>
            </div>
            <ul className="space-y-1">
              {casino.pros.map((pro, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">Cons</span>
            </div>
            <ul className="space-y-1">
              {casino.cons.map((con, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Rating */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition ${
                userRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-400'
              }`}
              onClick={() => {
                setUserRating(star);
                submitRating(star);
              }}
              style={{ pointerEvents: isSubmitting ? 'none' : 'auto' }}
            />
          ))}
          {userRating > 0 && (
            <span className="ml-2 text-sm text-gray-300">You rated: {userRating}</span>
          )}
          {submitMessage && (
            <span className="ml-4 text-xs text-green-400">{submitMessage}</span>
          )}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/90 font-semibold transition-all duration-200"
          onClick={() => window.open(casino.reviewUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Read Full Review
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;