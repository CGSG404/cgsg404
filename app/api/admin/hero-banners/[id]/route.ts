import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Fetch single hero banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Hero banner not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching hero banner:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hero banner' },
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

// PUT - Update hero banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update({
        title: body.title,
        subtitle: body.subtitle || null,
        highlight: body.highlight || null,
        cta_text: body.cta_text || null,
        cta_link: body.cta_link || null,
        image_url: body.image_url,
        gradient_class: body.gradient_class || 'from-casino-dark to-purple-900',
        display_order: body.display_order || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Hero banner not found' },
          { status: 404 }
        );
      }
      console.error('Error updating hero banner:', error);
      return NextResponse.json(
        { error: 'Failed to update hero banner' },
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

// DELETE - Delete hero banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting hero banner:', error);
      return NextResponse.json(
        { error: 'Failed to delete hero banner' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Hero banner deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}