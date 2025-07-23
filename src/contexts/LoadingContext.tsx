'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  loadingProgress: number;
  showLoading: (text?: string, progress?: number) => void;
  hideLoading: () => void;
  setLoadingText: (text: string) => void;
  setLoadingProgress: (progress: number) => void;
  isNavigating: boolean;
  setNavigating: (navigating: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingCountRef = useRef(0);

  // Show loading with optional text and progress
  const showLoading = useCallback((text?: string, progress?: number) => {
    loadingCountRef.current += 1;
    
    if (text) setLoadingText(text);
    if (typeof progress === 'number') setLoadingProgress(progress);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsLoading(true);
  }, []);

  // Hide loading with debounce to prevent flashing
  const hideLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    
    // Only hide if no other loading operations are pending
    if (loadingCountRef.current === 0) {
      // Small delay to prevent flashing
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
        setLoadingText('Loading...');
      }, 150);
    }
  }, []);

  // Set navigation state
  const setNavigating = useCallback((navigating: boolean) => {
    setIsNavigating(navigating);
    if (navigating) {
      showLoading('Navigating...');
    } else {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value: LoadingContextType = {
    isLoading,
    loadingText,
    loadingProgress,
    showLoading,
    hideLoading,
    setLoadingText,
    setLoadingProgress,
    isNavigating,
    setNavigating,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Hook for navigation loading
export function useNavigationLoading() {
  const { isNavigating, setNavigating } = useLoading();
  
  const startNavigation = useCallback(() => {
    setNavigating(true);
  }, [setNavigating]);
  
  const endNavigation = useCallback(() => {
    setNavigating(false);
  }, [setNavigating]);
  
  return {
    isNavigating,
    startNavigation,
    endNavigation,
  };
}

// Hook for async operations with loading
export function useAsyncLoading() {
  const { showLoading, hideLoading } = useLoading();
  
  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      showLoading(loadingText);
      const result = await operation();
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);
  
  return { withLoading };
}
