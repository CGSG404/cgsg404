'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

const PerformanceMonitor: React.FC = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'first-contentful-paint': {
            metricsRef.current.fcp = entry.startTime;
            break;
          }
          case 'largest-contentful-paint': {
            metricsRef.current.lcp = entry.startTime;
            break;
          }
          case 'first-input': {
            // Type assertion for PerformanceEntry to FirstInputEntry
            const firstInputEntry = entry as PerformanceEntry & {
              processingStart: number;
            };
            metricsRef.current.fid = firstInputEntry.processingStart - entry.startTime;
            break;
          }
          case 'layout-shift': {
            // Type assertion for PerformanceEntry to LayoutShiftEntry
            const layoutShiftEntry = entry as PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            };
            if (!layoutShiftEntry.hadRecentInput) {
              metricsRef.current.cls += layoutShiftEntry.value;
            }
            break;
          }
        }
      }
    });

    // Observe different performance metrics
    observer.observe({ entryTypes: ['first-contentful-paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Measure TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Report metrics after page load
    const reportMetrics = () => {
      const metrics = metricsRef.current;
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Performance Metrics:', {
          FCP: `${metrics.fcp.toFixed(2)}ms`,
          LCP: `${metrics.lcp.toFixed(2)}ms`,
          FID: `${metrics.fid.toFixed(2)}ms`,
          CLS: metrics.cls.toFixed(3),
          TTFB: `${metrics.ttfb.toFixed(2)}ms`,
        });
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // You can send metrics to your analytics service here
        // Example: sendToAnalytics(metrics);
      }
    };

    // Report after 5 seconds to ensure all metrics are captured
    const timeoutId = setTimeout(reportMetrics, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor; 