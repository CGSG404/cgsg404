import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Check maintenance status for a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    const pagePath = decodeURIComponent(params.path);
    
    // Convert encoded path back to actual path
    const actualPath = pagePath === 'home' ? '/' : `/${pagePath}`;

    const { data, error } = await supabase.rpc('get_page_maintenance_status', {
      page_path_param: actualPath
    });

    if (error) {
      console.error('Error checking maintenance status:', error);
      return NextResponse.json({ error: 'Failed to check maintenance status' }, { status: 500 });
    }

    // If no data found, assume page is not in maintenance
    if (!data || data.length === 0) {
      return NextResponse.json({ 
        is_maintenance: false, 
        maintenance_message: null 
      });
    }

    return NextResponse.json({
      is_maintenance: data[0].is_maintenance,
      maintenance_message: data[0].maintenance_message
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
