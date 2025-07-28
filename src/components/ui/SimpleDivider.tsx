'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleDividerProps {
  variant?: 'default' | 'gradient' | 'dotted' | 'thick' | 'minimal' | 'casino' | 'neon';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

const SimpleDivider: React.FC<SimpleDividerProps> = ({
  variant = 'default',
  orientation = 'horizontal',
  className,
  children,
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'my-4',
    md: 'my-8',
    lg: 'my-12',
    xl: 'my-16'
  };

  const variantClasses = {
    default: 'border-casino-border-subtle',
    gradient: 'border-0 h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent',
    dotted: 'border-casino-border-subtle border-dotted',
    thick: 'border-casino-neon-green/30 border-2',
    minimal: 'border-gray-600/30',
    casino: 'border-casino-neon-green/40 border-2',
    neon: 'border-0 h-0.5 bg-casino-neon-green'
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn(
        'border-l h-full',
        variantClasses[variant],
        className
      )} />
    );
  }

  if (children) {
    return (
      <div className={cn(spacingClasses[spacing], 'flex items-center', className)}>
        <div className={cn(
          'flex-1 border-t',
          variant === 'gradient' 
            ? 'border-0 h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-casino-border-subtle/50'
            : variantClasses[variant]
        )} />
        <div className="px-4 text-gray-400 text-sm font-medium">
          {children}
        </div>
        <div className={cn(
          'flex-1 border-t',
          variant === 'gradient' 
            ? 'border-0 h-px bg-gradient-to-r from-casino-border-subtle/50 via-casino-neon-green/50 to-transparent'
            : variantClasses[variant]
        )} />
      </div>
    );
  }

  return (
    <div className={cn(
      spacingClasses[spacing],
      'w-full',
      variant === 'gradient' 
        ? 'h-px bg-gradient-to-r from-transparent via-casino-neon-green/50 to-transparent'
        : `border-t ${variantClasses[variant]}`,
      className
    )} />
  );
};

export default SimpleDivider;
