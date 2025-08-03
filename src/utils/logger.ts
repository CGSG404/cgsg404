/**
 * Production-safe logging utility
 * Hanya menampilkan log di development mode
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enableInProduction: boolean;
  minLevel: LogLevel;
}

class Logger {
  private config: LoggerConfig;
  private isDevelopment: boolean;
  private enableLogging: boolean;
  private logLevel: LogLevel;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // Check environment variables for logging control
    this.enableLogging = process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true';
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';
    
    this.config = {
      enableInProduction: this.enableLogging && !this.isDevelopment,
      minLevel: this.logLevel,
      ...config
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // Di production, hanya log jika explicitly enabled via environment
    if (!this.isDevelopment && !this.enableLogging) {
      return false;
    }

    // Check minimum level
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    return levels[level] >= levels[this.config.minLevel];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(`🔍 ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(`❌ ${message}`, ...args);
    }
  }

  // Khusus untuk production errors yang harus selalu di-log
  criticalError(message: string, ...args: unknown[]): void {
    console.error(`🚨 CRITICAL: ${message}`, ...args);
  }
}

// Export default logger instance
export const logger = new Logger();

// Export logger untuk auth context (dengan minimal logging di production)
export const authLogger = new Logger({
  enableInProduction: false,
  minLevel: 'error'
});

// Export logger untuk admin context (dengan minimal logging di production)
export const adminLogger = new Logger({
  enableInProduction: false,
  minLevel: 'error'
});

// Export logger untuk development debugging
export const devLogger = new Logger({
  enableInProduction: false,
  minLevel: 'debug'
});