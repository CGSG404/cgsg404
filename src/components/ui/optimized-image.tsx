'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { usePerformanceOptimization, ImageOptimizer } from '@/src/lib/performance-optimizer';
import { cn } from '@/src/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  lazy?: boolean;
  responsive?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  quality,
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  lazy = true,
  responsive = true,
  ...props
}: OptimizedImageProps) {
  const { deviceInfo, getOptimalImageQuality, shouldUseLazyLoading } = usePerformanceOptimization();
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Get optimal quality based on device capabilities
  const optimalQuality = quality || getOptimalImageQuality();
  
  // Determine if we should use lazy loading
  const useLazyLoading = lazy && shouldUseLazyLoading() && !priority;

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (responsive && deviceInfo ? 
    ImageOptimizer.getResponsiveImageSizes(deviceInfo.isMobile) : 
    undefined
  );

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!useLazyLoading || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [useLazyLoading, isInView]);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallbackSrc);
    onError?.();
  };

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1f2e';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div 
      className={cn(
        'animate-pulse bg-casino-border-subtle rounded',
        className
      )}
      style={{ 
        width: width || '100%', 
        height: height || '200px',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-casino-neon-green/30 border-t-casino-neon-green rounded-full animate-spin" />
      </div>
    </div>
  );

  // Error fallback component
  const ErrorFallback = () => (
    <div 
      className={cn(
        'bg-casino-border-subtle rounded flex items-center justify-center text-gray-400',
        className
      )}
      style={{ 
        width: width || '100%', 
        height: height || '200px',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">📷</div>
        <div className="text-sm">Image not available</div>
      </div>
    </div>
  );

  // Don't render image until it's in view (for lazy loading)
  if (useLazyLoading && !isInView) {
    return (
      <div ref={imgRef}>
        <LoadingSkeleton />
      </div>
    );
  }

  // Show error fallback if image failed to load
  if (hasError && imageSrc === fallbackSrc) {
    return <ErrorFallback />;
  }

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ 
        width: fill ? '100%' : width, 
        height: fill ? '100%' : height,
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Loading skeleton overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <LoadingSkeleton />
        </div>
      )}

      {/* Optimized Next.js Image */}
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={optimalQuality}
        loading={priority ? 'eager' : 'lazy'}
        placeholder={placeholder}
        blurDataURL={blurDataURL || (placeholder === 'blur' ? generateBlurDataURL() : undefined)}
        sizes={responsiveSizes}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill ? 'object-cover' : '',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* WebP support indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-20">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            {ImageOptimizer.getWebPSupport() ? 'WebP' : 'Fallback'}
          </div>
        </div>
      )}
    </div>
  );
}

// Preset configurations for common use cases
export const CasinoLogo = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    width={120}
    height={80}
    quality={85}
    placeholder="blur"
    {...props}
  />
);

export const CasinoHeroImage = (props: Omit<OptimizedImageProps, 'fill' | 'sizes'>) => (
  <OptimizedImage
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={90}
    priority
    placeholder="blur"
    {...props}
  />
);

export const CasinoThumbnail = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    width={200}
    height={150}
    quality={80}
    placeholder="blur"
    lazy
    {...props}
  />
);

export const UserAvatar = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    width={40}
    height={40}
    quality={75}
    className="rounded-full"
    {...props}
  />
);

// Performance monitoring component - Now integrated into FloatingWidgetManager
export function ImagePerformanceMonitor() {
  // This component is deprecated - performance monitoring is now handled by FloatingWidgetManager
  return null;
}
