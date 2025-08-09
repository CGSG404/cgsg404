import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Fetch specific homepage content item
export async function GET(
  request: NextRequest,
  { params }: { params: { component: string; id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { component, id } = params;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tableName = getTableName(component);
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid component' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching homepage content item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content item' },
      { status: 500 }
    );
  }
}

// PUT - Update specific homepage content item
export async function PUT(
  request: NextRequest,
  { params }: { params: { component: string; id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { component, id } = params;
    const body = await request.json();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tableName = getTableName(component);
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid component' }, { status: 400 });
    }

    // Remove id and timestamps from update data
    const { id: _, created_at, updated_at, ...updateData } = body;

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating homepage content item:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage content item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific homepage content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { component: string; id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { component, id } = params;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tableName = getTableName(component);
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid component' }, { status: 400 });
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting homepage content item:', error);
    return NextResponse.json(
      { error: 'Failed to delete homepage content item' },
      { status: 500 }
    );
  }
}

// Helper function to get table name from component
function getTableName(component: string): string | null {
  const tableMap: Record<string, string> = {
    'hero-slider': 'hero_slider_casinos',
    'banner-info': 'banner_info_content',
    'faq': 'faq_items',
    'logo-slider': 'logo_slider_items',
    'chart': 'chart_data',
    'ticker': 'ticker_items',
    'hero-section': 'hero_section_content'
  };
  
  return tableMap[component] || null;
}