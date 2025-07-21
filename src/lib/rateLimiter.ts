// src/lib/rateLimiter.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const requestStore = new Map<string, RequestRecord>();

/**
 * Rate limiter middleware for API endpoints
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      // Get client identifier (IP address + User-Agent for better uniqueness)
      const clientId = getClientId(req);
      const now = Date.now();
      
      // Clean up expired records
      cleanupExpiredRecords(now);
      
      // Get or create record for this client
      let record = requestStore.get(clientId);
      
      if (!record || now > record.resetTime) {
        // Create new record or reset expired one
        record = {
          count: 1,
          resetTime: now + config.windowMs
        };
        requestStore.set(clientId, record);
      } else {
        // Increment existing record
        record.count++;
      }
      
      // Check if limit exceeded
      if (record.count > config.maxRequests) {
        const resetTimeSeconds = Math.ceil((record.resetTime - now) / 1000);
        
        res.status(429).json({
          success: false,
          error: config.message || 'Too many requests',
          retryAfter: resetTimeSeconds,
          limit: config.maxRequests,
          windowMs: config.windowMs,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - record.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      
      // Continue to next middleware/handler
      next();
      
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Don't block requests if rate limiter fails
      next();
    }
  };
}

/**
 * Get unique client identifier
 */
function getClientId(req: NextApiRequest): string {
  // Try to get real IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.socket.remoteAddress || 'unknown';
  
  // Include User-Agent for better uniqueness (but hash it for privacy)
  const userAgent = req.headers['user-agent'] || 'unknown';
  const crypto = require('crypto');
  const hashedUA = crypto.createHash('sha256').update(userAgent).digest('hex').substring(0, 16);
  
  return `${ip}:${hashedUA}`;
}

/**
 * Clean up expired records to prevent memory leaks
 */
function cleanupExpiredRecords(now: number) {
  for (const [clientId, record] of requestStore.entries()) {
    if (now > record.resetTime) {
      requestStore.delete(clientId);
    }
  }
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // For encryption/decryption operations (more restrictive)
  encryption: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many encryption requests. Please try again later.'
  },
  
  // For debug/testing endpoints (very restrictive)
  debug: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20, // 20 requests per 5 minutes
    message: 'Too many debug requests. Please try again later.'
  },
  
  // For general API endpoints
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000, // 1000 requests per 15 minutes
    message: 'Too many requests. Please try again later.'
  }
};

/**
 * Wrapper function to apply rate limiting to API handlers
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const rateLimiter = createRateLimiter(config);
    
    return new Promise<void>((resolve, reject) => {
      rateLimiter(req, res, async () => {
        try {
          await handler(req, res);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  };
}
