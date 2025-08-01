'use client';

// Global error handler for client-side exceptions
export const setupGlobalErrorHandler = () => {
  if (typeof window === 'undefined') return;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default browser behavior (showing error in console)
    event.preventDefault();
    
    // Log additional context
    console.error('🔍 Error details:', {
      type: 'unhandledrejection',
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Check if it's an auth-related error
    let errorMessage = 'Unknown error';
    try {
      errorMessage = event.reason?.message || String(event.reason);
    } catch (stringError) {
      console.error('❌ Error converting reason to string:', stringError);
      errorMessage = 'Error processing failed';
    }

    // Check for split function errors
    if (errorMessage.includes('split is not a function')) {
      console.log('🔧 Split function error detected, attempting recovery...');

      // Try to recover by clearing problematic state
      try {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();

        // Redirect to home with recovery message
        setTimeout(() => {
          window.location.href = '/?error=client_exception&details=' + encodeURIComponent('Application error recovered. Please try again.');
        }, 1000);
      } catch (recoveryError) {
        console.error('❌ Recovery attempt failed:', recoveryError);
      }
      return;
    }

    if (errorMessage.includes('auth') || errorMessage.includes('oauth') || errorMessage.includes('supabase')) {
      console.log('🔐 Auth-related error detected, attempting recovery...');

      // Try to recover by clearing auth state
      try {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();

        // Redirect to home with error message
        setTimeout(() => {
          window.location.href = '/?error=auth_recovery&message=' + encodeURIComponent('Authentication error recovered. Please try logging in again.');
        }, 1000);
      } catch (recoveryError) {
        console.error('❌ Recovery attempt failed:', recoveryError);
      }
    }
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('🚨 Global JavaScript Error:', event.error);
    
    // Log additional context
    console.error('🔍 Error details:', {
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Check if it's a critical error that should trigger recovery
    const errorMessage = event.message || '';
    if (errorMessage.includes('client-side exception') || 
        errorMessage.includes('ChunkLoadError') ||
        errorMessage.includes('Loading chunk')) {
      
      console.log('🔄 Critical error detected, attempting page recovery...');
      
      // Try to recover by reloading the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });

  console.log('✅ Global error handlers setup complete');
};

// Function to manually report errors
export const reportError = (error: Error, context?: string) => {
  console.error(`🚨 Manual Error Report${context ? ` (${context})` : ''}:`, error);
  
  console.error('🔍 Error context:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown'
  });
};

// Function to check if we're in a recovery state
export const isInRecoveryMode = () => {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('error') && (
    urlParams.get('error') === 'auth_recovery' ||
    urlParams.get('error') === 'client_exception' ||
    urlParams.get('error') === 'callback_failed'
  );
};

// Function to clear recovery state
export const clearRecoveryState = () => {
  if (typeof window === 'undefined') return;

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (params.has('error') || params.has('success') || params.has('details')) {
      params.delete('error');
      params.delete('message');
      params.delete('details');
      params.delete('success');
      params.delete('timestamp');

      const newUrl = url.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
  } catch (error) {
    console.error('❌ Failed to clear recovery state:', error);
    // Fallback: just replace with clean URL
    try {
      window.history.replaceState({}, '', window.location.pathname);
    } catch (fallbackError) {
      console.error('❌ Fallback URL clear failed:', fallbackError);
    }
  }
};
