import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Handle CORS for all requests
  const response = NextResponse.next()

  // Check admin routes first
  if (request.nextUrl.pathname.startsWith('/debug-admin')) {
    const supabase = createMiddlewareClient({ req: request, res: response });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session, redirect to sign in
      if (!session) {
        console.log('🚫 Admin route access denied: No session');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/signin';
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Check if user is admin
      const { data: isAdmin, error } = await supabase.rpc('is_admin');

      if (error || !isAdmin) {
        console.log('🚫 Admin route access denied: Not admin', { error, isAdmin });
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/';
        return NextResponse.redirect(redirectUrl);
      }

      console.log('✅ Admin route access granted');
    } catch (error) {
      console.error('❌ Error in admin middleware:', error);
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
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
