'use client';

import { cn } from '@/src/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  fullScreen = false,
  message
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinner = (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
      
      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-2 border-casino-neon-green border-t-transparent animate-spin"></div>
      
      {/* Inner dot */}
      <div className="absolute inset-2 rounded-full bg-casino-neon-green/20 animate-pulse"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {spinner}
        {message && (
          <p className="mt-4 text-gray-400 text-sm animate-pulse">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {message && (
        <p className="mt-2 text-gray-400 text-xs">{message}</p>
      )}
    </div>
  );
}