// Simple error logging utility
// In a production app, you would integrate with a service like Sentry

interface ErrorInfo {
  error: Error;
  context?: Record<string, unknown>;
}

export const logError = ({ error, context = {} }: ErrorInfo) => {
  if (import.meta.env.PROD) {
    // In production, you would send this to your error tracking service
    console.error('Error:', error, 'Context:', context);
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
  if (import.meta.env.DEV) {
    console.info(`[INFO] ${message}`, data || '');
  }
};

export const logWarning = (message: string, data?: unknown) => {
  console.warn(`[WARN] ${message}`, data || '');
};
