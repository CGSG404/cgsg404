import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Pages that should be checked for maintenance mode
const MAINTENANCE_PAGES = [
  '/',
  '/top-casinos',
  '/casinos-singapore',
  '/reviews',
  '/list-report',
  '/forum',
  '/guide',
  '/news'
];

export async function middleware(request: NextRequest) {
  // 🔄 URL REDIRECTS: Handle legacy URLs
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // 🔐 ADMIN SUBDOMAIN ROUTING: Handle sg44admin subdomain (standardized)
  if ((hostname.startsWith('sg44admin.') && hostname.endsWith('.gurusingapore.com')) || hostname.includes('sg44admin.localhost')) {
    // Force redirect to /admin if not already there
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = '/admin' + url.pathname;
      return NextResponse.redirect(url);
    }
  } else {
    // In production: Block access to /admin routes on non-admin hosts
    // In preview/dev: allow /admin so testing can be done on vercel.app or localhost
    const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
    if (isProduction && url.pathname.startsWith('/admin')) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Redirect /games to /top-casinos
  if (url.pathname === '/games') {
    url.pathname = '/top-casinos';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // Redirect /casinos to /casinos-singapore
  if (url.pathname === '/casinos') {
    url.pathname = '/casinos-singapore';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // 🌐 DOMAIN REDIRECT: Force www.gurusingapore.com (only in production)
  if (process.env.NODE_ENV === 'production') {
    // Redirect from gurusingapore.com to www.gurusingapore.com (except admin subdomain)
    if (hostname === 'gurusingapore.com') {
      url.host = 'www.gurusingapore.com';
      url.protocol = 'https:';
      return NextResponse.redirect(url, 301); // Permanent redirect
    }
  }

  // Handle CORS for all requests
  const response = NextResponse.next()

  // Skip middleware for auth callback routes to prevent redirect loops
  if (request.nextUrl.pathname.startsWith('/auth/callback') ||
      request.nextUrl.pathname.startsWith('/signin') ||
      request.nextUrl.pathname.startsWith('/api/')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Skipping middleware for route:', request.nextUrl.pathname);
    }
    return response;
  }

  // 🚀 ADMIN SUBDOMAIN: Let admin routes pass through when on sg44admin subdomain
  if (((hostname.startsWith('sg44admin.') && hostname.endsWith('.gurusingapore.com')) || hostname.includes('sg44admin.localhost')) && request.nextUrl.pathname.startsWith('/admin')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Admin subdomain route accessed:', request.nextUrl.pathname);
    }

    // Optional IP allowlist (comma-separated). Example: "1.2.3.4,5.6.7.8"
    const allowedIps = (process.env.ADMIN_ALLOWED_IPS || '')
      .split(',')
      .map(ip => ip.trim())
      .filter(Boolean);
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || request.headers.get('cf-connecting-ip')
      || '';
    if (allowedIps.length > 0 && clientIp && !allowedIps.includes(clientIp)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Optional Basic Auth for admin subdomain
    const basicUser = process.env.ADMIN_BASIC_AUTH_USER;
    const basicPass = process.env.ADMIN_BASIC_AUTH_PASS;
    if (basicUser && basicPass) {
      const authHeader = request.headers.get('authorization') || '';
      const [scheme, encoded] = authHeader.split(' ');
      if (scheme !== 'Basic' || !encoded) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
        });
      }
      try {
        // Edge runtime-safe base64 decode
        const decoded = typeof atob !== 'undefined' ? atob(encoded) : '';
        const [user, pass] = decoded.split(':');
        if (user !== basicUser || pass !== basicPass) {
          return new NextResponse('Unauthorized', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
          });
        }
      } catch {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }
        });
      }
    }

    // Add noindex header for admin
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  }

  // 🚀 MAINTENANCE MODE: Handled client-side by MaintenanceWrapper
  // Removed server-side check to prevent duplicate Supabase clients and slow middleware



  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, apikey, x-client-info')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, apikey, x-client-info',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  // Special handling for auth routes
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    console.log('🔄 Auth middleware:', {
      path: request.nextUrl.pathname,
      method: request.method,
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer')
    })
    
    // Add additional headers for auth routes
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
