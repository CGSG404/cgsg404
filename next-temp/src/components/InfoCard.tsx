import React from 'react';
import { Card } from '@/components/ui/card';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactElement;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon, className = '' }) => {
  return (
    <Card className={`bg-casino-card-bg border-casino-border-subtle p-6 h-full ${className}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="text-casino-neon-green flex-shrink-0 mt-1">
            {React.cloneElement(icon, { className: 'w-8 h-8' })}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default InfoCard;
