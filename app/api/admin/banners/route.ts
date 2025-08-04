import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabaseClient';

// Fallback banners data when database table doesn't exist
const fallbackBanners = [
  {
    id: 1,
    title: 'Welcome to CGSG!',
    subtitle: 'Your Trusted Casino Guide Singapore',
    highlight: 'DISCOVER THE BEST CASINOS! 🎰',
    cta_text: 'Get Started',
    cta_link: '/casinos',
    image_url: '/news-banner/domain.png',
    gradient_class: 'from-casino-dark to-purple-900',
    page_type: 'home',
    display_order: 1,
    is_active: true
  },
  {
    id: 2,
    title: 'Exclusive Bonuses',
    subtitle: 'Up to 200% Welcome Bonus + Free Spins',
    highlight: 'CLAIM YOUR BONUS NOW! 🎁',
    cta_text: 'View Bonuses',
    cta_link: '/best-bonuses',
    image_url: '/news-banner/domain1.png',
    gradient_class: 'from-casino-dark to-purple-900',
    page_type: 'home',
    display_order: 2,
    is_active: true
  },
  {
    id: 3,
    title: 'Success Stories',
    subtitle: 'Join Our Winning Community',
    highlight: 'BE THE NEXT WINNER! 🏆',
    cta_text: 'Read Stories',
    cta_link: '/success-stories',
    image_url: '/success-stories-cgsg.png',
    gradient_class: 'from-casino-dark to-purple-900',
    page_type: 'home',
    display_order: 3,
    is_active: true
  }
];

// GET - Fetch all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('page_type') || 'home';

    // Try to fetch from database first
    try {
      const { data: banners, error } = await supabase
        .from('banners')
        .select('*')
        .eq('page_type', pageType)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Database error fetching banners:', error);
        // If table doesn't exist or other database error, use fallback
        const filteredBanners = fallbackBanners.filter(banner => banner.page_type === pageType);
        return NextResponse.json({ 
          banners: filteredBanners,
          fallback: true,
          message: 'Using fallback banners due to database error'
        });
      }

      if (banners && banners.length > 0) {
        return NextResponse.json({ banners });
      }

      // If no banners found in database, use fallback
      const filteredBanners = fallbackBanners.filter(banner => banner.page_type === pageType);
      return NextResponse.json({ 
        banners: filteredBanners,
        fallback: true,
        message: 'No banners found in database, using fallback'
      });

    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Use fallback banners if database connection fails
      const filteredBanners = fallbackBanners.filter(banner => banner.page_type === pageType);
      return NextResponse.json({ 
        banners: filteredBanners,
        fallback: true,
        message: 'Using fallback banners due to database connection error'
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    // Return fallback banners even if there's an API error
    const filteredBanners = fallbackBanners.filter(banner => banner.page_type === 'home');
    return NextResponse.json({ 
      banners: filteredBanners,
      fallback: true,
      message: 'Using fallback banners due to API error'
    });
  }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      highlight,
      cta_text,
      cta_link,
      image_url,
      gradient_class,
      page_type = 'home',
      display_order = 0
    } = body;

    // Validate required fields
    if (!title || !subtitle) {
      return NextResponse.json({ error: 'Title and subtitle are required' }, { status: 400 });
    }

    // Try to insert into database
    try {
      const { data: banner, error } = await supabase
        .from('banners')
        .insert([{
          title,
          subtitle,
          highlight,
          cta_text,
          cta_link,
          image_url,
          gradient_class,
          page_type,
          display_order,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating banner:', error);
        return NextResponse.json({ 
          error: 'Failed to create banner - database table may not exist',
          fallback: true
        }, { status: 500 });
      }

      return NextResponse.json({ banner }, { status: 201 });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update banner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    try {
      const { data: banner, error } = await supabase
        .from('banners')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating banner:', error);
        return NextResponse.json({ 
          error: 'Failed to update banner - database table may not exist',
          fallback: true
        }, { status: 500 });
      }

      return NextResponse.json({ banner });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete banner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });
    }

    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting banner:', error);
        return NextResponse.json({ 
          error: 'Failed to delete banner - database table may not exist',
          fallback: true
        }, { status: 500 });
      }

      return NextResponse.json({ message: 'Banner deleted successfully' });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
