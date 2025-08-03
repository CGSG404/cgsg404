/**
 * Production Console Override
 * Menggantikan console methods di production untuk mengurangi noise
 */

// Simpan console methods asli
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

// Override console methods di production
export function setupProductionConsole() {
  if (process.env.NODE_ENV === 'production') {
    // Di production, hanya tampilkan error dan warning yang critical
    console.log = () => {}; // Disable semua console.log
    console.info = () => {}; // Disable console.info
    console.debug = () => {}; // Disable console.debug
    
    // Hanya tampilkan warning dan error yang benar-benar penting
    console.warn = (...args: unknown[]) => {
      // Filter hanya warning yang critical
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('CRITICAL') ||
        message.includes('SECURITY') ||
        message.includes('FATAL')
      )) {
        originalConsole.warn(...args);
      }
    };

    console.error = (...args: unknown[]) => {
      // Filter hanya error yang critical
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('🚨') ||
        message.includes('CRITICAL') ||
        message.includes('SECURITY') ||
        message.includes('FATAL') ||
        message.includes('Auth Error') ||
        message.includes('Database Error')
      )) {
        originalConsole.error(...args);
      }
    };
  }
}

// Restore console methods (untuk testing)
export function restoreConsole() {
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.debug = originalConsole.debug;
}

// Development-only console
export const devConsole = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      originalConsole.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      originalConsole.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      originalConsole.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Error selalu ditampilkan
    originalConsole.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      originalConsole.debug(...args);
    }
  },
};