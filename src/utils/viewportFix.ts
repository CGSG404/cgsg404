/**
 * Dynamic Viewport Height Fix for Mobile Browsers
 * Solves iOS Safari and Android Chrome viewport height issues
 */

export function initViewportFix() {
  // Set initial viewport height
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // iOS Safari detection
  const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOSSafari) {
    // Use window.innerHeight for iOS Safari
    const setIOSHeight = () => {
      const height = window.innerHeight;
      document.documentElement.style.setProperty('--ios-height', `${height}px`);
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
    };
    
    window.addEventListener('resize', setIOSHeight);
    window.addEventListener('orientationchange', setIOSHeight);
    setIOSHeight();
  } else {
    // Standard viewport height for other browsers
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    setViewportHeight();
  }

  // Handle reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleReducedMotion = (mediaQuery: MediaQueryList | MediaQueryListEvent) => {
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  // Set initial state
  handleReducedMotion(prefersReducedMotion);
  
  // Listen for changes
  prefersReducedMotion.addEventListener('change', handleReducedMotion);
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewportFix);
  } else {
    initViewportFix();
  }
}