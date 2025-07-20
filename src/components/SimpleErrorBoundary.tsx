'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class SimpleErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error);
    console.error('🔍 Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-casino-dark text-white p-8">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold text-red-400 mb-4">
                🚨 Something went wrong
              </h1>
              <p className="text-gray-300 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-casino-neon-green text-casino-dark px-4 py-2 rounded hover:bg-casino-neon-green/90"
              >
                Reload Page
              </button>
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-casino-neon-green">
                  Show Error Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
