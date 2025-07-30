// Simple error logging utility
// In a production app, you would integrate with a service like Sentry

interface ErrorInfo {
  error: Error;
  context?: Record<string, unknown>;
}

export const logError = ({ error, context = {} }: ErrorInfo) => {
  if (process.env.NODE_ENV === 'production') {
    // Production error reporting - send to external service
    try {
      // Send to error tracking service (Sentry, LogRocket, etc.)
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          name: error.name,
          context,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
        })
      }).catch(reportError => {
        console.error('Failed to report error:', reportError);
      });
    } catch (reportError) {
      console.error('Error reporting failed:', reportError);
    }

    // Still log to console as fallback
    console.error('Error:', error.message, 'Context:', context);
  } else {
    // In development, log to console with more details
    console.group('Error Details');
    console.error('Error:', error);
    if (Object.keys(context).length > 0) {
      console.log('Context:', context);
    }
    console.groupEnd();
  }
};

export const logInfo = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[INFO] ${message}`, data || '');
  }
};

export const logWarning = (message: string, data?: unknown) => {
  console.warn(`[WARN] ${message}`, data || '');
};
