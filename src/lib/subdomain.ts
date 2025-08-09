/**
 * Utility functions for subdomain detection and routing
 */

/**
 * Check if current request is from admin subdomain
 */
export function isAdminSubdomain(hostname?: string): boolean {
  if (typeof window !== 'undefined') {
    hostname = window.location.hostname;
  }
  
  if (!hostname) return false;
  
  return hostname === 'sg44admin.gurusingapore.com' || 
         hostname === 'sg44admin.www.gurusingapore.com' ||
         hostname.includes('sg44admin.localhost');
}

/**
 * Get the appropriate base URL based on subdomain
 */
export function getBaseUrl(isAdmin: boolean = false): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    if (isAdmin || isAdminSubdomain(hostname)) {
      if (hostname.includes('localhost')) {
        return `${protocol}//sg44admin.localhost${port ? ':' + port : ''}`;
      }
      return `${protocol}//sg44admin.gurusingapore.com`;
    }
    
    if (hostname.includes('localhost')) {
      return `${protocol}//localhost${port ? ':' + port : ''}`;
    }
    return `${protocol}//www.gurusingapore.com`;
  }
  
  // Server-side fallback
  return isAdmin 
    ? (process.env.NEXT_PUBLIC_ADMIN_URL || 'https://sg44admin.gurusingapore.com')
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gurusingapore.com');
}

/**
 * Redirect to admin subdomain
 */
export function redirectToAdmin(path: string = '/admin'): void {
  if (typeof window !== 'undefined') {
    const adminUrl = `${getBaseUrl(true)}${path}`;
    window.location.href = adminUrl;
  }
}

/**
 * Redirect to main site
 */
export function redirectToMain(path: string = '/'): void {
  if (typeof window !== 'undefined') {
    const mainUrl = `${getBaseUrl(false)}${path}`;
    window.location.href = mainUrl;
  }
}

/**
 * Get current domain type
 */
export function getDomainType(): 'main' | 'admin' {
  return isAdminSubdomain() ? 'admin' : 'main';
}