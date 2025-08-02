import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Get all page maintenance statuses
export async function GET() {
  try {
    const { data: pages, error } = await supabase
      .from('page_maintenance')
      .select('*')
      .order('page_path');

    if (error) {
      console.error('Error fetching page maintenance:', error);
      return NextResponse.json({ error: 'Failed to fetch page maintenance' }, { status: 500 });
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Toggle maintenance mode for a page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, is_maintenance, maintenance_message } = body;

    // Validate required fields
    if (!page_path || typeof is_maintenance !== 'boolean') {
      return NextResponse.json({ 
        error: 'page_path and is_maintenance are required' 
      }, { status: 400 });
    }

    // Call the database function to toggle maintenance
    const { data, error } = await supabase.rpc('toggle_page_maintenance', {
      page_path_param: page_path,
      maintenance_status: is_maintenance,
      message_param: maintenance_message || null
    });

    if (error) {
      console.error('Error toggling maintenance:', error);
      return NextResponse.json({ error: 'Failed to toggle maintenance mode' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get updated page data
    const { data: updatedPage, error: fetchError } = await supabase
      .from('page_maintenance')
      .select('*')
      .eq('page_path', page_path)
      .single();

    if (fetchError) {
      console.error('Error fetching updated page:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch updated page' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      page: updatedPage,
      message: `Maintenance mode ${is_maintenance ? 'enabled' : 'disabled'} for ${page_path}`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update maintenance message for a page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_path, maintenance_message } = body;

    // Validate required fields
    if (!page_path || !maintenance_message) {
      return NextResponse.json({ 
        error: 'page_path and maintenance_message are required' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('page_maintenance')
      .update({ maintenance_message })
      .eq('page_path', page_path)
      .select()
      .single();

    if (error) {
      console.error('Error updating maintenance message:', error);
      return NextResponse.json({ error: 'Failed to update maintenance message' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      page: data,
      message: `Maintenance message updated for ${page_path}`
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
