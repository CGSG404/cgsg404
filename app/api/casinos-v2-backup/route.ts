import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://www.gurusingapore.com' 
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/casinos-v2 - Optimized casino data fetching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50); // Max 50 per request
    const search = searchParams.get('search') || '';
    const safetyIndex = searchParams.get('safetyIndex')?.split(',') || [];
    const isNew = searchParams.get('isNew') === 'true';
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const isHot = searchParams.get('isHot') === 'true';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

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

    // Apply filters - only apply if values are meaningful
    if (search && search.trim()) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,bonus.ilike.%${search}%`);
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
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Supabase query error:', error);
      }
      
      // Return mock data for development/fallback
      const availableFeatures = ['Live Dealers', 'Mobile Optimized', '24/7 Support', 'Crypto Payments', 'Fast Withdrawals', 'VIP Program'];
      const availableBadges = ['Verified', 'Popular', 'Trusted', 'Licensed', 'Secure'];
      
      return NextResponse.json({
        casinos: generateMockCasinos(limit),
        total: 20,
        page,
        limit,
        totalPages: Math.ceil(20 / limit),
        availableFeatures,
        availableBadges
      }, {
        status: 200,
        headers: corsHeaders
      });
    }

    // Transform data to optimized format
    const casinos = rawCasinos?.map(casino => ({
      id: casino.id,
      name: casino.name,
      slug: casino.slug,
      logo: casino.logo,
      rating: casino.rating,
      safetyIndex: casino.safety_index,
      bonus: casino.bonus,
      description: casino.description,
      playUrl: casino.play_url,
      isNew: casino.is_new,
      isHot: casino.is_hot,
      isFeatured: casino.is_featured,
      features: casino.casino_features?.map(f => f.feature) || [],
      badges: casino.casino_badges?.map(b => b.badge) || [],
      links: {
        bonus: casino.casino_links?.find(l => l.link_type === 'bonus')?.url || casino.play_url,
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

    const availableFeatures = ['Live Dealers', 'Mobile Optimized', '24/7 Support', 'Crypto Payments', 'Fast Withdrawals', 'VIP Program'];
    const availableBadges = ['Verified', 'Popular', 'Trusted', 'Licensed', 'Secure'];
    
    return NextResponse.json({
      casinos: generateMockCasinos(12),
      total: 20,
      page: 1,
      limit: 12,
      totalPages: 2,
      availableFeatures,
      availableBadges
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Generate mock casino data for development/fallback
function generateMockCasinos(count: number) {
  const mockCasinos = [];
  const casinoNames = [
    'Royal Vegas Casino', 'Golden Palace', 'Diamond Crown', 'Lucky Star Casino',
    'Platinum Elite', 'Silver Moon', 'Crystal Bay Casino', 'Emerald Isle',
    'Ruby Fortune', 'Sapphire Lounge', 'Pearl Harbor Casino', 'Jade Garden',
    'Opal Dreams', 'Topaz Tower', 'Amber Palace', 'Onyx Elite',
    'Coral Reef Casino', 'Ivory Coast', 'Marble Mansion', 'Bronze Star'
  ];

  const safetyIndexes = ['Very High', 'High', 'Medium', 'Low'];
  const bonuses = [
    '100% up to $500 + 50 Free Spins',
    '200% up to $1000 Welcome Bonus',
    '150% up to $750 + 100 Free Spins',
    '300% up to $2000 Mega Bonus',
    '125% up to $625 + 25 Free Spins'
  ];

  const features = [
    ['Live Dealers', 'Mobile Optimized', '24/7 Support'],
    ['Crypto Payments', 'Fast Withdrawals', 'VIP Program'],
    ['Sports Betting', 'Live Casino', 'Tournaments'],
    ['No Deposit Bonus', 'Free Spins', 'Cashback'],
    ['Multi-Language', 'Secure Gaming', 'Fair Play']
  ];

  for (let i = 0; i < count; i++) {
    const name = casinoNames[i % casinoNames.length];
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 - 5.0
    
    mockCasinos.push({
      id: i + 1,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      logo: `/casino-logos/${name.toLowerCase().replace(/\s+/g, '-')}.png`,
      rating,
      safetyIndex: safetyIndexes[Math.floor(Math.random() * safetyIndexes.length)],
      bonus: bonuses[Math.floor(Math.random() * bonuses.length)],
      description: `Experience premium gaming at ${name} with top-tier security, exciting games, and generous bonuses. Join thousands of satisfied players today!`,
      playUrl: `https://example.com/play/${name.toLowerCase().replace(/\s+/g, '-')}`,
      isNew: Math.random() > 0.8,
      isHot: Math.random() > 0.7,
      isFeatured: Math.random() > 0.6,
      features: features[Math.floor(Math.random() * features.length)],
      badges: Math.random() > 0.5 ? ['Verified', 'Popular'] : ['Trusted'],
      links: {
        bonus: `https://example.com/bonus/${i + 1}`,
        review: `https://example.com/review/${i + 1}`,
        complaint: `https://example.com/complaint/${i + 1}`
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return mockCasinos;
}