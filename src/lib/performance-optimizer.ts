// src/lib/performance-optimizer.ts
import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowEnd: boolean;
  connectionType: string;
  memoryGB: number;
}

/**
 * Performance Optimizer for mobile and responsive design
 */
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: Partial<PerformanceMetrics> = {};
  private deviceInfo: DeviceInfo;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.deviceInfo = this.detectDevice();
    this.initializePerformanceMonitoring();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Detect device capabilities and connection
   */
  private detectDevice(): DeviceInfo {
    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    // Detect low-end devices
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isLowEnd = memory <= 2 || cores <= 2;

    // Detect connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connectionType = connection?.effectiveType || 'unknown';

    return {
      isMobile,
      isTablet,
      isDesktop,
      isLowEnd,
      connectionType,
      memoryGB: memory
    };
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor navigation timing
    this.observeNavigationTiming();
  }

  /**
   * Observe Core Web Vitals
   */
  private observeWebVitals(): void {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        // Log slow resources
        if (entry.duration > 1000) {
          console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      }
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Get device information
   */
  getDeviceInfo(): DeviceInfo {
    return { ...this.deviceInfo };
  }

  /**
   * Check if device should use reduced animations
   */
  shouldReduceAnimations(): boolean {
    return this.deviceInfo.isLowEnd || 
           this.deviceInfo.connectionType === 'slow-2g' || 
           this.deviceInfo.connectionType === '2g';
  }

  /**
   * Check if device should use lazy loading
   */
  shouldUseLazyLoading(): boolean {
    return this.deviceInfo.isMobile || 
           this.deviceInfo.isLowEnd || 
           ['slow-2g', '2g', '3g'].includes(this.deviceInfo.connectionType);
  }

  /**
   * Get optimal image quality based on device
   */
  getOptimalImageQuality(): number {
    if (this.deviceInfo.isLowEnd || ['slow-2g', '2g'].includes(this.deviceInfo.connectionType)) {
      return 60; // Lower quality for low-end devices
    }
    if (this.deviceInfo.connectionType === '3g') {
      return 75; // Medium quality for 3G
    }
    return 90; // High quality for good connections
  }

  /**
   * Get optimal chunk size for data loading
   */
  getOptimalChunkSize(): number {
    if (this.deviceInfo.isLowEnd) return 5;
    if (this.deviceInfo.isMobile) return 10;
    return 20;
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * React hook for performance optimization
 */
export function usePerformanceOptimization() {
  const [optimizer] = useState(() => PerformanceOptimizer.getInstance());
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    setDeviceInfo(optimizer.getDeviceInfo());
    
    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(optimizer.getMetrics());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [optimizer]);

  const shouldReduceAnimations = useCallback(() => {
    return optimizer.shouldReduceAnimations();
  }, [optimizer]);

  const shouldUseLazyLoading = useCallback(() => {
    return optimizer.shouldUseLazyLoading();
  }, [optimizer]);

  const getOptimalImageQuality = useCallback(() => {
    return optimizer.getOptimalImageQuality();
  }, [optimizer]);

  const getOptimalChunkSize = useCallback(() => {
    return optimizer.getOptimalChunkSize();
  }, [optimizer]);

  return {
    metrics,
    deviceInfo,
    shouldReduceAnimations,
    shouldUseLazyLoading,
    getOptimalImageQuality,
    getOptimalChunkSize
  };
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  static getOptimizedImageUrl(
    originalUrl: string, 
    width: number, 
    height: number, 
    quality: number = 90
  ): string {
    // For Next.js Image optimization
    const params = new URLSearchParams({
      url: originalUrl,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString()
    });
    
    return `/_next/image?${params.toString()}`;
  }

  static getResponsiveImageSizes(isMobile: boolean): string {
    if (isMobile) {
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }
    return '(max-width: 1200px) 50vw, 33vw';
  }

  static getWebPSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
}

/**
 * Lazy loading utilities
 */
export class LazyLoadManager {
  private static observer: IntersectionObserver | null = null;

  static createObserver(callback: (entries: IntersectionObserverEntry[]) => void): IntersectionObserver {
    if (!this.observer) {
      this.observer = new IntersectionObserver(callback, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
    }
    return this.observer;
  }

  static observeElement(element: Element, callback: () => void): void {
    const observer = this.createObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === element) {
          callback();
          observer.unobserve(element);
        }
      });
    });

    observer.observe(element);
  }
}
