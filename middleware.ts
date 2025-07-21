import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Handle CORS for all requests
  const response = NextResponse.next()

  // Skip middleware for auth callback routes and debug pages to prevent redirect loops
  if (request.nextUrl.pathname.startsWith('/auth/callback') ||
      request.nextUrl.pathname.startsWith('/signin') ||
      request.nextUrl.pathname.startsWith('/session-fix') ||
      request.nextUrl.pathname.startsWith('/debug-admin') ||
      request.nextUrl.pathname.startsWith('/fix-admin')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Skipping middleware for route:', request.nextUrl.pathname);
    }
    return response;
  }

  // Check admin routes first
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req: request, res: response });

    try {
      // 🚀 PRODUCTION FIX: Enhanced session checking
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      // If no session, redirect to sign in
      if (!session || sessionError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚫 Admin route access denied: No session', {
            path: request.nextUrl.pathname,
            sessionError: sessionError?.message,
            hasSession: !!session
          });
        }
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/signin';
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // 🔧 Enhanced admin check with better error handling
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

      if (adminError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('🚫 Admin RPC error:', {
            path: request.nextUrl.pathname,
            error: adminError.message,
            userId: session?.user?.id,
            userEmail: session?.user?.email
          });
        }

        // 🚀 PRODUCTION FIX: On RPC error, redirect to session-fix page
        const redirectUrl = request.nextUrl.clone();
        if (process.env.NODE_ENV === 'production') {
          redirectUrl.pathname = '/session-fix';
          redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
          redirectUrl.searchParams.set('error', 'session_refresh_needed');
        } else {
          redirectUrl.pathname = '/signin';
          redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
          redirectUrl.searchParams.set('error', 'session_refresh_needed');
        }
        return NextResponse.redirect(redirectUrl);
      }

      if (!isAdmin) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚫 Admin route access denied: Not admin', {
            path: request.nextUrl.pathname,
            isAdmin,
            userId: session?.user?.id,
            userEmail: session?.user?.email
          });
        }

        // In development, redirect to fix page instead of home
        const redirectUrl = request.nextUrl.clone();
        if (process.env.NODE_ENV === 'development') {
          redirectUrl.pathname = '/fix-admin';
          redirectUrl.searchParams.set('error', 'admin_access_denied');
          redirectUrl.searchParams.set('user_email', session?.user?.email || '');
        } else {
          redirectUrl.pathname = '/';
          redirectUrl.searchParams.set('error', 'admin_access_denied');
        }
        return NextResponse.redirect(redirectUrl);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Admin route access granted:', request.nextUrl.pathname);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error in admin middleware:', error);
      }

      // 🚀 PRODUCTION FIX: On middleware error, redirect to session-fix
      const redirectUrl = request.nextUrl.clone();
      if (process.env.NODE_ENV === 'production') {
        redirectUrl.pathname = '/session-fix';
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        redirectUrl.searchParams.set('error', 'middleware_error');
      } else {
        redirectUrl.pathname = '/signin';
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        redirectUrl.searchParams.set('error', 'middleware_error');
      }
      return NextResponse.redirect(redirectUrl);
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
