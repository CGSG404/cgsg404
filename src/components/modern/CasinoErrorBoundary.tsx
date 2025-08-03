'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class CasinoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Casino Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleContactSupport = () => {
    window.open('https://t.me/your_support_channel', '_blank', 'noopener,noreferrer');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-slate-700/50">
            <CardContent className="p-8 text-center">
              {/* Error Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We encountered an unexpected error while loading the casino data. 
                  This might be a temporary issue.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50 text-left">
                  <h3 className="text-sm font-semibold text-red-400 mb-2">
                    Error Details (Development):
                  </h3>
                  <div className="text-xs text-slate-400 font-mono space-y-1">
                    <div className="break-all">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div className="break-all max-h-32 overflow-y-auto">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-gradient-to-r from-casino-neon-green to-emerald-500 hover:from-casino-neon-green/90 hover:to-emerald-500/90 text-casino-dark font-semibold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>

                  <Button
                    variant="outline"
                    onClick={this.handleContactSupport}
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Support
                  </Button>
                </div>
              </div>

              {/* Additional Help */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-400">
                  If this problem persists, please contact our support team with the error details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useCasinoErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Casino Error Handler:', error, errorInfo);
    }

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }, []);

  return { handleError };
};

// Simple error fallback component
export const CasinoErrorFallback: React.FC<{
  error?: Error;
  onRetry?: () => void;
  message?: string;
}> = ({ 
  error, 
  onRetry, 
  message = "Failed to load casino data" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {message}
      </h3>
      
      {error && process.env.NODE_ENV === 'development' && (
        <p className="text-sm text-slate-400 mb-4 font-mono">
          {error.message}
        </p>
      )}
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default CasinoErrorBoundary;