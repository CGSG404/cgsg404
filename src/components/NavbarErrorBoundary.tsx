'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Simple fallback navbar component
const FallbackNavbar = () => (
  <nav className="bg-casino-card-bg border-b border-casino-border-subtle sticky top-0 z-50 w-full shadow-lg">
    <div className="w-full flex items-center justify-between h-16 px-6">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-casino-neon-green rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-casino-dark" />
        </div>
        <span className="text-xl gradient-text font-normal">CGSG</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <Link 
          href="/casinos" 
          className="text-white hover:text-casino-neon-green transition-colors"
        >
          Casinos
        </Link>
        <Link 
          href="/news" 
          className="text-white hover:text-casino-neon-green transition-colors"
        >
          News
        </Link>
        <Link 
          href="/reviews" 
          className="text-white hover:text-casino-neon-green transition-colors"
        >
          Reviews
        </Link>
        <Link 
          href="/signin" 
          className="bg-casino-neon-green hover:bg-casino-neon-green/80 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  </nav>
);

class NavbarErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 NavbarErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 NavbarErrorBoundary details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // Report to monitoring service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Navbar Error: ${error.message}`,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      console.warn('⚠️ NavbarErrorBoundary: Using fallback navbar due to error');
      
      // Use custom fallback if provided, otherwise use default
      return this.props.fallback || <FallbackNavbar />;
    }

    return this.props.children;
  }
}

export default NavbarErrorBoundary;
export { FallbackNavbar };
