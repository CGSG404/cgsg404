import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockPageMaintenanceData } from './mock-data';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// In-memory storage for development/testing
let maintenanceData = [...mockPageMaintenanceData];

// GET - Get all page maintenance statuses
export async function GET() {
  try {
    // Try database first
    const { data: pages, error } = await supabase
      .from('page_maintenance')
      .select('*')
      .order('page_path');

    if (error) {
      console.warn('Database not available, using mock data:', error.message);
      // Return mock data if database is not available
      return NextResponse.json({
        pages: maintenanceData.sort((a, b) => a.page_path.localeCompare(b.page_path)),
        mock: true
      });
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.warn('Database error, using mock data:', error);
    // Fallback to mock data
    return NextResponse.json({
      pages: maintenanceData.sort((a, b) => a.page_path.localeCompare(b.page_path)),
      mock: true
    });
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

    // Try database first
    try {
      const { data, error } = await supabase.rpc('toggle_page_maintenance', {
        page_path_param: page_path,
        maintenance_status: is_maintenance,
        message_param: maintenance_message || null
      });

      if (!error && data) {
        // Get updated page data
        const { data: updatedPage, error: fetchError } = await supabase
          .from('page_maintenance')
          .select('*')
          .eq('page_path', page_path)
          .single();

        if (!fetchError) {
          return NextResponse.json({
            success: true,
            page: updatedPage,
            message: `Maintenance mode ${is_maintenance ? 'enabled' : 'disabled'} for ${page_path}`
          });
        }
      }
    } catch (dbError) {
      console.warn('Database not available, using mock data');
    }

    // Fallback to mock data
    const pageIndex = maintenanceData.findIndex(p => p.page_path === page_path);
    if (pageIndex === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Update mock data
    maintenanceData[pageIndex] = {
      ...maintenanceData[pageIndex],
      is_maintenance,
      maintenance_message: maintenance_message || maintenanceData[pageIndex].maintenance_message,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      page: maintenanceData[pageIndex],
      message: `Maintenance mode ${is_maintenance ? 'enabled' : 'disabled'} for ${page_path}`,
      mock: true
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

    // Try database first
    try {
      const { data, error } = await supabase
        .from('page_maintenance')
        .update({ maintenance_message })
        .eq('page_path', page_path)
        .select()
        .single();

      if (!error) {
        return NextResponse.json({
          success: true,
          page: data,
          message: `Maintenance message updated for ${page_path}`
        });
      }
    } catch (dbError) {
      console.warn('Database not available, using mock data');
    }

    // Fallback to mock data
    const pageIndex = maintenanceData.findIndex(p => p.page_path === page_path);
    if (pageIndex === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Update mock data
    maintenanceData[pageIndex] = {
      ...maintenanceData[pageIndex],
      maintenance_message,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      page: maintenanceData[pageIndex],
      message: `Maintenance message updated for ${page_path}`,
      mock: true
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
