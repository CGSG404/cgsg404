/**
 * Security utilities for XSS protection and input sanitization
 */

// HTML entities mapping for XSS prevention
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
  '=': '&#x3D;'
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input.replace(/[&<>"'`=/]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * Sanitize user input for safe display
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .slice(0, 1000); // Limit length
}

/**
 * Validate and sanitize URL to prevent malicious redirects
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '#';
  
  // Allow only http, https, and relative URLs
  const allowedProtocols = /^(https?:\/\/|\/)/i;
  
  if (!allowedProtocols.test(url)) {
    return '#';
  }
  
  // Remove dangerous protocols
  const cleanUrl = url
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/file:/gi, '');
  
  return cleanUrl;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate casino name format
 */
export function isValidCasinoName(name: string): boolean {
  if (typeof name !== 'string') return false;
  
  // Allow letters, numbers, spaces, and common casino symbols
  const validPattern = /^[a-zA-Z0-9\s\-_&.()]+$/;
  return validPattern.test(name) && name.length >= 2 && name.length <= 100;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Content Security Policy headers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  ...CSP_HEADERS,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

/**
 * Validate and sanitize report data
 */
interface ReportData {
  casino_name?: string;
  status?: string;
  summary?: string;
  url?: string;
  last_reported?: string;
}

export function validateReportData(data: unknown): {
  isValid: boolean;
  sanitizedData?: ReportData;
  errors?: string[];
} {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid data format'] };
  }
  
  // Type assertion with safe property access
  const reportData = data as Record<string, unknown>;
  
  // Validate casino name
  if (!reportData.casino_name || typeof reportData.casino_name !== 'string' || !isValidCasinoName(reportData.casino_name)) {
    errors.push('Invalid casino name');
  }
  
  // Validate status
  const validStatuses = ['Unlicensed', 'Scam Indicated', 'Many Users Reported'];
  if (!reportData.status || typeof reportData.status !== 'string' || !validStatuses.includes(reportData.status)) {
    errors.push('Invalid status');
  }
  
  // Validate summary
  if (!reportData.summary || typeof reportData.summary !== 'string' || reportData.summary.trim().length < 10) {
    errors.push('Summary must be at least 10 characters');
  }
  
  if (reportData.summary && typeof reportData.summary === 'string' && reportData.summary.length > 2000) {
    errors.push('Summary too long (max 2000 characters)');
  }
  
  // Validate URL
  if (reportData.url && typeof reportData.url === 'string') {
    const sanitizedUrl = sanitizeUrl(reportData.url);
    if (sanitizedUrl === '#' && reportData.url !== '#') {
      errors.push('Invalid URL format');
    }
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Return sanitized data
  const sanitizedData: ReportData = {
    casino_name: sanitizeInput(reportData.casino_name as string),
    status: reportData.status as string,
    summary: sanitizeInput(reportData.summary as string),
    url: reportData.url ? sanitizeUrl(reportData.url as string) : '#',
    last_reported: (reportData.last_reported as string) || new Date().toISOString().split('T')[0]
  };
  
  return { isValid: true, sanitizedData };
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Hash sensitive data (simple implementation)
 */
export function hashData(data: string): string {
  let hash = 0;
  if (data.length === 0) return hash.toString();
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}