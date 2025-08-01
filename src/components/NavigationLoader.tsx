'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from '@/src/contexts/LoadingContext';
import { LoadingOverlay } from '@/src/components/LoadingScreen';

/**
 * NavigationLoader for Next.js App Router
 * Provides smooth loading transitions with proper timing
 */
export default function NavigationLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isNavigating, setNavigating, showLoading, hideLoading } = useLoading();
  const previousPathnameRef = useRef(pathname);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Handle navigation detection
  useEffect(() => {
    // Skip initial load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // Detect pathname change (navigation completed)
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      
      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      // End navigation with small delay for smooth transition
      navigationTimeoutRef.current = setTimeout(() => {
        setNavigating(false);
      }, 100);
    }
  }, [pathname, setNavigating]);

  // Override router methods to detect navigation start
  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    // Enhanced navigation tracking
    const startNavigation = (method: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 Navigation started: ${method}`);
      }
      setNavigating(true);
    };

    // Override router methods
    router.push = (...args) => {
      startNavigation('push');
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      startNavigation('replace');
      return originalReplace.apply(router, args);
    };

    router.back = () => {
      startNavigation('back');
      return originalBack.apply(router);
    };

    router.forward = () => {
      startNavigation('forward');
      return originalForward.apply(router);
    };

    // Handle browser navigation (back/forward buttons)
    const handlePopState = () => {
      startNavigation('popstate');
    };

    // Handle page refresh
    const handleBeforeUnload = () => {
      showLoading('Refreshing page...');
    };

    // Handle page visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && isNavigating) {
        // User switched tabs during navigation, hide loading
        setNavigating(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Restore original router methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
      
      // Clear timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [router, setNavigating, showLoading, isNavigating]);

  // Handle link clicks for better UX
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Check if it's an internal navigation
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          // Don't show loading for hash links or external links
          if (!url.hash && !link.target && !link.download) {
            setNavigating(true);
          }
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [setNavigating]);

  // Auto-hide loading after timeout (safety net)
  useEffect(() => {
    if (isNavigating) {
      const timeoutId = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Navigation timeout, force hiding loading');
        }
        setNavigating(false);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [isNavigating, setNavigating]);

  return (
    <LoadingOverlay
      isLoading={isLoading || isNavigating}
      text="Loading..."
      variant="minimal"
    />
  );
}
