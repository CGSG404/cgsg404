/**
 * Production Ready Console Utilities
 * Menggantikan console statements yang masih tersisa dengan production-safe alternatives
 */

// Production-safe console untuk error handling
export const productionConsole = {
  // Error logging - tetap aktif di production untuk debugging critical issues
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  
  // Warning - hanya untuk critical warnings
  warn: (...args: unknown[]) => {
    const message = args[0];
    if (typeof message === 'string' && (
      message.includes('CRITICAL') ||
      message.includes('SECURITY') ||
      message.includes('FATAL') ||
      message.includes('Navigation timeout') ||
      message.includes('Multiple GoTrueClient')
    )) {
      console.warn(...args);
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  
  // Info logging - hanya di development
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },
  
  // Debug logging - hanya di development
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  // Debug logging - hanya di development
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  }
};

// Conditional logging untuk development-only features
export const conditionalLog = {
  // Hanya log jika dalam development mode
  dev: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  // Log error tapi dengan format yang lebih bersih di production
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error);
    } else {
      // Di production, hanya log message tanpa detail error yang berlebihan
      console.error(message);
    }
  },
  
  // Warning yang dikondisikan
  warn: (message: string, details?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, details);
    } else if (message.includes('CRITICAL') || message.includes('SECURITY')) {
      console.warn(message);
    }
  }
};

// Utility untuk mengecek apakah logging diaktifkan
export const isLoggingEnabled = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true';
};

// Safe console untuk komponen yang memerlukan conditional logging
export const safeConsole = {
  log: (message: string, ...args: unknown[]) => {
    if (isLoggingEnabled()) {
      console.log(message, ...args);
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    // Error selalu ditampilkan, tapi dengan format yang berbeda
    if (process.env.NODE_ENV === 'development') {
      console.error(message, ...args);
    } else {
      // Di production, format error lebih sederhana
      console.error(message);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isLoggingEnabled() || message.includes('CRITICAL')) {
      console.warn(message, ...args);
    }
  }
};