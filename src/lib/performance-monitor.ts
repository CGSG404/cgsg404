// src/lib/performance-monitor.ts
interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Performance monitoring and caching for database operations
 */
export class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];
  private static cache = new Map<string, CacheEntry<any>>();
  private static readonly MAX_METRICS = 1000;
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Start tracking a database operation
   */
  static startOperation(operation: string, metadata?: Record<string, any>): string {
    const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.metrics.push({
      operation: `${operation}:${operationId}`,
      startTime: Date.now(),
      success: false,
      metadata
    });

    // Keep metrics array size manageable
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS / 2);
    }

    return operationId;
  }

  /**
   * End tracking a database operation
   */
  static endOperation(operation: string, operationId: string, success: boolean, error?: string) {
    const fullOperation = `${operation}:${operationId}`;
    const metric = this.metrics.find(m => m.operation === fullOperation);
    
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = success;
      metric.error = error;
    }
  }

  /**
   * Get performance statistics
   */
  static getStats(operation?: string) {
    const relevantMetrics = operation 
      ? this.metrics.filter(m => m.operation.startsWith(operation))
      : this.metrics;

    if (relevantMetrics.length === 0) {
      return {
        totalOperations: 0,
        successRate: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        recentOperations: []
      };
    }

    const completedMetrics = relevantMetrics.filter(m => m.duration !== undefined);
    const durations = completedMetrics.map(m => m.duration!);
    const successCount = completedMetrics.filter(m => m.success).length;

    return {
      totalOperations: completedMetrics.length,
      successRate: completedMetrics.length > 0 ? (successCount / completedMetrics.length * 100).toFixed(2) : '0',
      averageResponseTime: durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0,
      minResponseTime: durations.length > 0 ? Math.min(...durations) : 0,
      maxResponseTime: durations.length > 0 ? Math.max(...durations) : 0,
      recentOperations: completedMetrics.slice(-10).map(m => ({
        operation: m.operation.split(':')[0],
        duration: m.duration,
        success: m.success,
        timestamp: new Date(m.startTime).toISOString(),
        error: m.error
      }))
    };
  }

  /**
   * Cache data with TTL
   */
  static setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Clean up expired entries periodically
    if (this.cache.size % 100 === 0) {
      this.cleanupCache();
    }
  }

  /**
   * Get cached data if not expired
   */
  static getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Clear cache for specific key or all
   */
  static clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Clean up expired cache entries
   */
  private static cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: '0%', // Would need to track hits/misses for accurate rate
      memoryUsage: `${Math.round(JSON.stringify([...this.cache.entries()]).length / 1024)}KB`
    };
  }

  /**
   * Wrapper function for database operations with monitoring
   */
  static async monitorOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    cacheKey?: string,
    cacheTtl?: number
  ): Promise<T> {
    // Check cache first
    if (cacheKey) {
      const cached = this.getCache<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    const operationId = this.startOperation(operation, { cacheKey });
    
    try {
      const result = await fn();
      this.endOperation(operation, operationId, true);
      
      // Cache successful results
      if (cacheKey && result !== null && result !== undefined) {
        this.setCache(cacheKey, result, cacheTtl);
      }
      
      return result;
    } catch (error) {
      this.endOperation(operation, operationId, false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}

/**
 * Database operation wrapper with performance monitoring
 */
export function withPerformanceMonitoring<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = `${operation}:${JSON.stringify(args)}`;
    
    return PerformanceMonitor.monitorOperation(
      operation,
      () => fn(...args),
      cacheKey
    );
  };
}

/**
 * Query optimization helpers
 */
export class QueryOptimizer {
  /**
   * Generate optimized cache key for database queries
   */
  static generateCacheKey(operation: string, params: Record<string, any>): string {
    // Sort params for consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);

    return `${operation}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Determine optimal cache TTL based on data type
   */
  static getOptimalTTL(dataType: 'casino' | 'news' | 'user' | 'search'): number {
    const ttlMap = {
      casino: 10 * 60 * 1000,    // 10 minutes - casino data changes infrequently
      news: 5 * 60 * 1000,      // 5 minutes - news updates more often
      user: 2 * 60 * 1000,      // 2 minutes - user data can change frequently
      search: 1 * 60 * 1000     // 1 minute - search results should be fresh
    };

    return ttlMap[dataType] || 5 * 60 * 1000;
  }

  /**
   * Check if query should be cached based on complexity
   */
  static shouldCache(params: Record<string, any>): boolean {
    // Don't cache very specific queries (likely one-time)
    const hasSpecificFilters = Object.keys(params).length > 5;
    
    // Don't cache queries with user-specific data
    const hasUserData = 'userId' in params || 'user_id' in params;
    
    // Don't cache real-time data requests
    const isRealTime = params.realTime === true;

    return !hasSpecificFilters && !hasUserData && !isRealTime;
  }
}
