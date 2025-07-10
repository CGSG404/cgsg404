import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  casino: {
    id: number;
    name: string;
    logo: string;
    reviewUrl: string;
  };
}

const ReviewCard = ({ casino }: ReviewCardProps) => {
  return (
    <Card className="flex flex-col items-stretch overflow-hidden bg-casino-card-bg border border-casino-border-subtle">
      {/* Logo / Banner */}
      <div className="h-28 w-full relative bg-black/70">
        <Image
          src={casino.logo}
          alt={casino.name}
          fill
          className="object-contain p-4" // padding to avoid edges
          unoptimized
        />
      </div>

      {/* Casino name */}
      <div className="py-4 px-3 flex-grow flex items-center justify-center">
        <h3 className="text-center text-white font-semibold leading-snug text-lg">
          {casino.name}
        </h3>
      </div>

      {/* Bottom action button */}
      <div className="p-4 pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green/10"
        >
          <a href={casino.reviewUrl} className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4" /> Expert review
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default ReviewCard;