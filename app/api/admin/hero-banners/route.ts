import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Fetch all hero banners
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching hero banners:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hero banners' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new hero banner
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'image_url'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('hero_banners')
      .insert([
        {
          title: body.title,
          subtitle: body.subtitle || null,
          highlight: body.highlight || null,
          cta_text: body.cta_text || null,
          cta_link: body.cta_link || null,
          image_url: body.image_url,
          gradient_class: body.gradient_class || 'from-casino-dark to-purple-900',
          display_order: body.display_order || 0,
          is_active: body.is_active !== undefined ? body.is_active : true,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating hero banner:', error);
      return NextResponse.json(
        { error: 'Failed to create hero banner' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}