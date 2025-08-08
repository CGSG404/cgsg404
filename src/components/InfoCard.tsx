import React from 'react';
import { Card } from '@/src/components/ui/card';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactElement;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon, className = '' }) => {
  return (
    <Card className={`bg-casino-card-bg border-casino-border-subtle p-4 sm:p-6 h-full touch-target card-hover transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {icon && (
          <div className="text-casino-neon-green flex-shrink-0 mt-1 p-2 rounded-lg bg-casino-neon-green/10">
            {React.cloneElement(icon, { className: 'w-6 h-6 sm:w-8 sm:h-8' })}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default InfoCard;
