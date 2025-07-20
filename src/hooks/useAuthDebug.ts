"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

export interface AuthDebugInfo {
  // Current state
  user: any;
  loading: boolean;
  error: string | null;
  
  // Debug metrics
  initCount: number;
  lastEvent: string;
  lastUpdate: Date;
  
  // Performance tracking
  renderCount: number;
  lastRender: Date;
  
  // Error tracking
  errorHistory: Array<{
    error: string;
    timestamp: Date;
    context: string;
  }>;
  
  // State change history
  stateHistory: Array<{
    event: string;
    user: boolean;
    loading: boolean;
    timestamp: Date;
  }>;
}

export const useAuthDebug = (): AuthDebugInfo => {
  const auth = useAuth();
  const [errorHistory, setErrorHistory] = useState<AuthDebugInfo['errorHistory']>([]);
  const [stateHistory, setStateHistory] = useState<AuthDebugInfo['stateHistory']>([]);

  // Track renders - FIXED: Use useRef to avoid infinite re-renders
  const renderCountRef = useRef(0);
  const lastRenderRef = useRef(new Date());

  // Increment render count on each render (without causing re-render)
  renderCountRef.current += 1;
  lastRenderRef.current = new Date();

  // Track errors
  useEffect(() => {
    if (auth.error) {
      setErrorHistory(prev => [
        ...prev.slice(-9), // Keep last 10 errors
        {
          error: auth.error,
          timestamp: new Date(),
          context: 'AuthContext',
        }
      ]);
    }
  }, [auth.error]);

  // Track state changes
  useEffect(() => {
    setStateHistory(prev => [
      ...prev.slice(-19), // Keep last 20 state changes
      {
        event: auth.debugInfo?.lastEvent || 'unknown',
        user: !!auth.user,
        loading: auth.loading,
        timestamp: new Date(),
      }
    ]);
  }, [auth.user, auth.loading, auth.debugInfo?.lastEvent]);

  return {
    // Current state
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    
    // Debug metrics from AuthContext
    initCount: auth.debugInfo?.initCount || 0,
    lastEvent: auth.debugInfo?.lastEvent || 'none',
    lastUpdate: auth.debugInfo?.lastUpdate || new Date(),
    
    // Performance tracking
    renderCount: renderCountRef.current,
    lastRender: lastRenderRef.current,
    
    // Error tracking
    errorHistory,
    
    // State change history
    stateHistory,
  };
};

// Helper hook for monitoring auth performance
export const useAuthPerformanceMonitor = () => {
  const debug = useAuthDebug();
  
  useEffect(() => {
    // Log performance warnings
    if (debug.renderCount > 10) {
      console.warn(`⚠️ Auth Debug: High render count detected (${debug.renderCount})`);
    }
    
    if (debug.initCount > 3) {
      console.warn(`⚠️ Auth Debug: Multiple initializations detected (${debug.initCount})`);
    }
    
    if (debug.errorHistory.length > 5) {
      console.warn(`⚠️ Auth Debug: Multiple errors detected (${debug.errorHistory.length})`);
    }
  }, [debug.renderCount, debug.initCount, debug.errorHistory.length]);
  
  return {
    isHealthy: debug.renderCount < 10 && debug.initCount < 3 && debug.errorHistory.length < 3,
    warnings: {
      highRenderCount: debug.renderCount > 10,
      multipleInits: debug.initCount > 3,
      multipleErrors: debug.errorHistory.length > 5,
    },
    metrics: {
      renderCount: debug.renderCount,
      initCount: debug.initCount,
      errorCount: debug.errorHistory.length,
    }
  };
};
