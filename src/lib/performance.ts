/**
 * Performance optimization utilities
 */

import { lazy, ComponentType } from 'react';

/**
 * Lazy load component with error boundary
 */
export function lazyLoad<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(importFunc);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
}

/**
 * Prefetch next page resources
 */
export function prefetchPage(href: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUrl(
  src: string,
  width: number,
  quality: number = 75
): string {
  if (!src || src.startsWith('data:')) return src;
  
  // For Next.js Image optimization
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString()
  });
  
  return `/_next/image?${params.toString()}`;
}

/**
 * Bundle size analyzer helper
 */
export function measureBundleSize(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  // Measure JavaScript bundle size
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  let totalSize = 0;

  scripts.forEach(script => {
    const src = (script as HTMLScriptElement).src;
    if (src.includes('_next/static')) {
      fetch(src, { method: 'HEAD' })
        .then(response => {
          const size = parseInt(response.headers.get('content-length') || '0');
          totalSize += size;
          console.log(`📦 Bundle: ${src.split('/').pop()} - ${(size / 1024).toFixed(2)}KB`);
        })
        .catch(() => {});
    }
  });

  setTimeout(() => {
    console.log(`📊 Total Bundle Size: ${(totalSize / 1024).toFixed(2)}KB`);
  }, 1000);
}

/**
 * Performance metrics collector
 */
export function collectPerformanceMetrics(): void {
  if (typeof window === 'undefined') return;

  // Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('🎯 LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming & { processingStart: number };
        console.log('⚡ FID:', fidEntry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
        }
      });
      console.log('📐 CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('🚀 Performance Metrics:', {
        'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
        'TCP Connection': navigation.connectEnd - navigation.connectStart,
        'Request': navigation.responseStart - navigation.requestStart,
        'Response': navigation.responseEnd - navigation.responseStart,
        'DOM Processing': navigation.domContentLoadedEventStart - navigation.responseEnd,
        'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
        'Total Load Time': navigation.loadEventEnd - navigation.fetchStart
      });
    }, 0);
  });
}

/**
 * Memory usage monitor
 */
export function monitorMemoryUsage(): void {
  if (typeof window === 'undefined') return;
  
  const performanceMemory = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (!performanceMemory) return;

  const memory = performanceMemory;
  console.log('💾 Memory Usage:', {
    'Used': `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
    'Total': `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
    'Limit': `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
  });
}

/**
 * Critical CSS inliner
 */
export function inlineCriticalCSS(css: string): void {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Service Worker registration
 */
export function registerServiceWorker(swPath: string = '/sw.js'): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('✅ SW registered:', registration);
      })
      .catch((error) => {
        console.log('❌ SW registration failed:', error);
      });
  });
}

/**
 * Resource hints helper
 */
export function addResourceHints(): void {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.google-analytics.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
}

/**
 * Optimize third-party scripts
 */
export function loadThirdPartyScript(
  src: string,
  async: boolean = true,
  defer: boolean = true
): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
}

/**
 * Image lazy loading with intersection observer
 */
export function setupImageLazyLoading(): void {
  if (typeof window === 'undefined') return;

  const imageObserver = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}