import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Pages that should be checked for maintenance mode
const MAINTENANCE_PAGES = [
  '/',
  '/top-casinos',
  '/casinos',
  '/reviews',
  '/list-report',
  '/forum',
  '/guide',
  '/news'
];

export async function middleware(request: NextRequest) {
  // 🔄 URL REDIRECTS: Handle legacy URLs
  const url = request.nextUrl.clone();

  // Redirect /games to /top-casinos
  if (url.pathname === '/games') {
    url.pathname = '/top-casinos';
    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // 🌐 DOMAIN REDIRECT: Force www.gurusingapore.com (only in production)
  if (process.env.NODE_ENV === 'production') {
    const hostname = request.headers.get('host') || '';

    // Redirect from gurusingapore.com to www.gurusingapore.com
    if (hostname === 'gurusingapore.com') {
      url.host = 'www.gurusingapore.com';
      url.protocol = 'https:';
      return NextResponse.redirect(url, 301); // Permanent redirect
    }
  }

  // Handle CORS for all requests
  const response = NextResponse.next()

  // Skip middleware for auth callback routes and debug pages to prevent redirect loops
  if (request.nextUrl.pathname.startsWith('/auth/callback') ||
      request.nextUrl.pathname.startsWith('/signin') ||
      request.nextUrl.pathname.startsWith('/session-fix') ||
      request.nextUrl.pathname.startsWith('/debug-admin') ||
      request.nextUrl.pathname.startsWith('/debug-session') ||
      request.nextUrl.pathname.startsWith('/fix-admin') ||
      request.nextUrl.pathname.startsWith('/api/')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Skipping middleware for route:', request.nextUrl.pathname);
    }
    return response;
  }

  // 🚀 SIMPLIFIED ADMIN PROTECTION: Use client-side protection instead
  // This prevents middleware session issues
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Admin route accessed, letting client handle auth:', request.nextUrl.pathname);
    }
    // Let the page handle authentication client-side
    return response;
  }

  // 🔧 MAINTENANCE MODE CHECK
  if (MAINTENANCE_PAGES.includes(request.nextUrl.pathname)) {
    try {
      // Initialize Supabase client for maintenance check
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Check if page is in maintenance mode
      const { data, error } = await supabase.rpc('get_page_maintenance_status', {
        page_path_param: request.nextUrl.pathname
      });

      if (!error && data && data.length > 0 && data[0].is_maintenance) {
        // Page is in maintenance mode - let client-side MaintenanceWrapper handle it
        // We don't redirect here to allow admin bypass on client-side
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Page in maintenance mode:', request.nextUrl.pathname);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('🔧 Maintenance check error:', error);
      }
      // If there's an error, allow access (fail open)
    }
  }



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
