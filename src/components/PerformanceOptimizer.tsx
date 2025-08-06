'use client';

import { useEffect } from 'react';

/**
 * PerformanceOptimizer - Komponen untuk mengoptimalkan performa halaman
 * Menangani preloading, prefetching, dan optimasi loading
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload important images
      const criticalImages = [
        '/news-banner/domain.png',
        '/news-banner/domain1.png',
        '/success-stories-cgsg.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Prefetch next pages when user hovers over links
    const prefetchOnHover = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      
      links.forEach(link => {
        let timeoutId: NodeJS.Timeout;
        
        link.addEventListener('mouseenter', () => {
          timeoutId = setTimeout(() => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.href = href;
              document.head.appendChild(prefetchLink);
            }
          }, 100); // Small delay to avoid prefetching on quick hovers
        });

        link.addEventListener('mouseleave', () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        });
      });
    };

    // Optimize images with Intersection Observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-lazy]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.getAttribute('data-lazy');
              if (src) {
                img.src = src;
                img.removeAttribute('data-lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    // Remove unused CSS classes (client-side optimization)
    const cleanupUnusedStyles = () => {
      // Remove any inline styles that might be causing layout shifts
      const elements = document.querySelectorAll('[style*="visibility: hidden"]');
      elements.forEach(el => {
        (el as HTMLElement).style.removeProperty('visibility');
      });
    };

    // Service Worker registration for caching (if available)
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('Service Worker registration failed:', err);
        });
      }
    };

    // Run optimizations
    preloadCriticalResources();
    
    // Run other optimizations after initial load
    const timer = setTimeout(() => {
      prefetchOnHover();
      optimizeImages();
      cleanupUnusedStyles();
      registerServiceWorker();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Monitor Core Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Simple performance monitoring for development
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('🚀 Page Performance:', {
              'DNS Lookup': navEntry.domainLookupEnd - navEntry.domainLookupStart,
              'Connection': navEntry.connectEnd - navEntry.connectStart,
              'Request': navEntry.responseStart - navEntry.requestStart,
              'Response': navEntry.responseEnd - navEntry.responseStart,
              'DOM Loading': navEntry.domContentLoadedEventEnd - navEntry.responseEnd,
              'Total Load Time': navEntry.loadEventEnd - navEntry.navigationStart
            });
          }
        }
      });

      observer.observe({ type: 'navigation', buffered: true });

      return () => observer.disconnect();
    }
  }, []);

  return null; // This component doesn't render anything
}