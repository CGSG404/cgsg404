'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePerformanceOptimization } from '@/src/lib/performance-optimizer';
import { useIsMobile } from '@/src/hooks/use-mobile';
import { cn } from '@/src/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  enablePerformanceMode?: boolean;
  showPerformanceIndicator?: boolean;
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full';
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
}

export function ResponsiveLayout({ 
  children, 
  className,
  enablePerformanceMode = true,
  showPerformanceIndicator = false
}: ResponsiveLayoutProps) {
  const { deviceInfo, shouldReduceAnimations } = usePerformanceOptimization();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply performance optimizations
  useEffect(() => {
    if (!enablePerformanceMode || !mounted) return;

    const root = document.documentElement;
    
    // Apply performance classes based on device capabilities
    if (deviceInfo?.isLowEnd) {
      root.classList.add('low-end-device');
    }
    
    if (shouldReduceAnimations()) {
      root.classList.add('reduce-motion');
    }

    if (deviceInfo?.isMobile) {
      root.classList.add('mobile-device');
    }

    return () => {
      root.classList.remove('low-end-device', 'reduce-motion', 'mobile-device');
    };
  }, [deviceInfo, shouldReduceAnimations, enablePerformanceMode, mounted]);

  if (!mounted) {
    // Server-side rendering fallback
    return (
      <div className={cn('min-h-screen bg-casino-dark', className)}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'min-h-screen bg-casino-dark',
        'mobile:min-h-mobile', // Use dvh on mobile
        deviceInfo?.isLowEnd && 'performance-mode',
        className
      )}
      style={{
        // Safe area insets for mobile devices
        paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: isMobile ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: isMobile ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
      
      {/* Performance indicator for development */}
      {showPerformanceIndicator && process.env.NODE_ENV === 'development' && (
        <PerformanceIndicator />
      )}
    </div>
  );
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }
}: ResponsiveGridProps) {
  const { deviceInfo } = usePerformanceOptimization();
  
  return (
    <div 
      className={cn(
        'grid',
        `grid-cols-${cols.mobile}`,
        `md:grid-cols-${cols.tablet}`,
        `lg:grid-cols-${cols.desktop}`,
        'gap-4 md:gap-6 lg:gap-8',
        className
      )}
      style={{
        gap: deviceInfo?.isMobile ? gap.mobile : 
             deviceInfo?.isTablet ? gap.tablet : 
             gap.desktop
      }}
    >
      {children}
    </div>
  );
}

export function ResponsiveContainer({ 
  children, 
  className,
  maxWidth = 'wide',
  padding = { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }
}: ResponsiveContainerProps) {
  const { deviceInfo } = usePerformanceOptimization();
  
  const maxWidthClasses = {
    mobile: 'max-w-mobile',
    tablet: 'max-w-tablet',
    desktop: 'max-w-desktop',
    wide: 'max-w-wide',
    full: 'max-w-full'
  };

  return (
    <div 
      className={cn(
        'container mx-auto',
        maxWidthClasses[maxWidth],
        'px-4 md:px-6 lg:px-8',
        className
      )}
      style={{
        paddingLeft: deviceInfo?.isMobile ? padding.mobile : 
                    deviceInfo?.isTablet ? padding.tablet : 
                    padding.desktop,
        paddingRight: deviceInfo?.isMobile ? padding.mobile : 
                     deviceInfo?.isTablet ? padding.tablet : 
                     padding.desktop
      }}
    >
      {children}
    </div>
  );
}

// Performance indicator component - Now integrated into FloatingWidgetManager
function PerformanceIndicator() {
  // This component is deprecated - performance monitoring is now handled by FloatingWidgetManager
  return null;
}

// Responsive text component
export function ResponsiveText({ 
  children, 
  className,
  size = 'base',
  weight = 'normal'
}: {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}) {
  const sizeClasses = {
    xs: 'text-xs mobile:text-xs-mobile',
    sm: 'text-sm mobile:text-sm-mobile',
    base: 'text-base mobile:text-base-mobile',
    lg: 'text-lg mobile:text-lg-mobile',
    xl: 'text-xl mobile:text-xl-mobile',
    '2xl': 'text-2xl mobile:text-2xl-mobile',
    '3xl': 'text-3xl mobile:text-3xl-mobile'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <span className={cn(
      sizeClasses[size],
      weightClasses[weight],
      'leading-relaxed mobile:leading-normal',
      className
    )}>
      {children}
    </span>
  );
}

// Responsive button component
export function ResponsiveButton({ 
  children, 
  className,
  size = 'default',
  variant = 'default',
  ...props
}: {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm mobile:px-2 mobile:py-1 mobile:text-xs',
    default: 'px-4 py-2 text-base mobile:px-3 mobile:py-2 mobile:text-sm',
    lg: 'px-6 py-3 text-lg mobile:px-4 mobile:py-2.5 mobile:text-base'
  };

  const variantClasses = {
    default: 'bg-casino-card-bg text-white border border-casino-border-subtle hover:bg-casino-border-subtle',
    primary: 'bg-casino-neon-green text-casino-dark hover:bg-casino-neon-green/80',
    secondary: 'bg-casino-neon-purple text-white hover:bg-casino-neon-purple/80',
    outline: 'border border-casino-neon-green text-casino-neon-green hover:bg-casino-neon-green hover:text-casino-dark'
  };

  return (
    <button
      className={cn(
        'mobile-button touch-target',
        'rounded-lg font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-casino-neon-green focus:ring-offset-2 focus:ring-offset-casino-dark',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
