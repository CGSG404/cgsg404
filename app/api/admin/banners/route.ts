import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabaseClient';

// GET - Fetch all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('page_type') || 'home';

    const { data: banners, error } = await supabase
      .from('banners')
      .select('*')
      .eq('page_type', pageType)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
    }

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }

    return NextResponse.json({ banner }, { status: 201 });
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
      return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
    }

    return NextResponse.json({ banner });
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

    const { error } = await supabase
      .from('banners')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting banner:', error);
      return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
