import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sanitizeInput, SECURITY_HEADERS, RateLimiter } from '@/src/lib/security';

// Initialize Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Rate limiter for API requests
const rateLimiter = new RateLimiter(60, 60000); // 60 requests per minute

// CORS headers for production with security headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? 'https://www.gurusingapore.com'
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
  ...SECURITY_HEADERS
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/casinos - Optimized casino data fetching with security
export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     request.headers.get('cf-connecting-ip') ||
                     'anonymous';
    if (!rateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: corsHeaders
        }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse and sanitize query parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '12')), 50); // Max 50 per request
    const search = sanitizeInput(searchParams.get('search') || '');
    const safetyIndex = searchParams.get('safetyIndex')?.split(',').map(s => sanitizeInput(s)).filter(s => s) || [];
    const isNew = searchParams.get('isNew') === 'true';
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const isHot = searchParams.get('isHot') === 'true';
    const sortBy = sanitizeInput(searchParams.get('sortBy') || 'rating');
    const sortOrder = sanitizeInput(searchParams.get('sortOrder') || 'desc');

    // Build optimized query
    let query = supabase
      .from('casinos')
      .select(`
        id,
        name,
        slug,
        logo,
        rating,
        safety_index,
        bonus,
        description,
        play_url,
        is_new,
        is_hot,
        is_featured,
        created_at,
        updated_at,
        casino_features(feature),
        casino_badges(badge),
        casino_links(link_type, url)
      `, { count: 'exact' });

    // Apply filters - only apply if values are meaningful and safe
    if (search && search.trim() && search.length <= 100) {
      // Escape special characters for SQL LIKE query
      const escapedSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(`name.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%,bonus.ilike.%${escapedSearch}%`);
    }

    // Filter out empty strings from safetyIndex
    const validSafetyIndex = safetyIndex.filter(s => s && s.trim());
    if (validSafetyIndex.length > 0) {
      query = query.in('safety_index', validSafetyIndex);
    }

    if (isNew) {
      query = query.eq('is_new', true);
    }

    if (isFeatured) {
      query = query.eq('is_featured', true);
    }

    if (isHot) {
      query = query.eq('is_hot', true);
    }

    // Apply sorting with proper field mapping
    const sortFieldMapping: Record<string, string> = {
      'rating': 'rating',
      'name': 'name',
      'newest': 'created_at',
      'safety': 'safety_index',
      'featured': 'rating' // For featured, just sort by rating desc
    };
    
    const sortField = sortFieldMapping[sortBy] || 'rating';
    
    // Apply single sort order to avoid query conflicts
    query = query.order(sortField, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: rawCasinos, error, count } = await query;

    if (error) {
      console.error('❌ Database error:', {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
      
      // Return proper error response instead of mock data
      return NextResponse.json({
        error: 'Unable to fetch casino data. Please try again later.',
        errorCode: 'DB_CONNECTION_ERROR',
        timestamp: new Date().toISOString()
      }, {
        status: 503, // Service Unavailable
        headers: {
          ...corsHeaders,
          'Retry-After': '60' // Suggest retry after 60 seconds
        }
      });
    }

    // Transform data to optimized format with sanitization
    const casinos = rawCasinos?.map(casino => ({
      id: casino.id,
      name: sanitizeInput(casino.name || ''),
      slug: sanitizeInput(casino.slug || ''),
      logo: casino.logo || '/casino-logos/default-casino.png',
      rating: Math.max(0, Math.min(5, casino.rating || 0)),
      safetyIndex: sanitizeInput(casino.safety_index || 'Medium'),
      bonus: sanitizeInput(casino.bonus || ''),
      description: sanitizeInput(casino.description || ''),
      playUrl: casino.play_url || '#',
      isNew: Boolean(casino.is_new),
      isHot: Boolean(casino.is_hot),
      isFeatured: Boolean(casino.is_featured),
      features: casino.casino_features?.map(f => sanitizeInput(f.feature || '')) || [],
      badges: casino.casino_badges?.map(b => sanitizeInput(b.badge || '')) || [],
      links: {
        bonus: casino.casino_links?.find(l => l.link_type === 'bonus')?.url || casino.play_url || '#',
        review: casino.casino_links?.find(l => l.link_type === 'review')?.url || '#',
        complaint: casino.casino_links?.find(l => l.link_type === 'complaint')?.url || '#'
      },
      createdAt: casino.created_at,
      updatedAt: casino.updated_at
    })) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    // Get available features and badges for filters
    const availableFeatures = ['Live Dealers', 'Mobile Optimized', '24/7 Support', 'Crypto Payments', 'Fast Withdrawals', 'VIP Program'];
    const availableBadges = ['Verified', 'Popular', 'Trusted', 'Licensed', 'Secure'];

    return NextResponse.json({
      casinos,
      total: count || 0,
      page,
      limit,
      totalPages,
      availableFeatures,
      availableBadges
    }, {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', error);
    }

    return NextResponse.json({
      error: 'An unexpected error occurred. Please try again later.',
      errorCode: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}

