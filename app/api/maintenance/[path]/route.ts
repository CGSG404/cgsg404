import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && !url.includes('placeholder') && !key.includes('placeholder');
};

// Initialize Supabase client only if properly configured
const supabase = isSupabaseConfigured() ? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) : null;

// Mock maintenance data for development
const mockMaintenanceData = {
  '/': { is_maintenance: false, maintenance_message: null },
  '/top-casinos': { is_maintenance: false, maintenance_message: null },
  '/casinos': { is_maintenance: false, maintenance_message: null },
  '/reviews': { is_maintenance: false, maintenance_message: null },
  '/list-report': { is_maintenance: false, maintenance_message: null },
  '/forum': { is_maintenance: false, maintenance_message: null },
  '/guide': { is_maintenance: false, maintenance_message: null },
  '/news': { is_maintenance: false, maintenance_message: null }
};

// GET - Check maintenance status for a specific page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;
    const pagePath = decodeURIComponent(resolvedParams.path);
    
    console.log('🔧 Checking maintenance status for path:', pagePath);
    
    // Convert encoded path back to actual path
    const actualPath = pagePath === 'home' ? '/' : `/${pagePath}`;
    
    console.log('🔧 Converted to actual path:', actualPath);

    // Check if Supabase is configured
    if (!supabase) {
      console.log('⚠️ Supabase not configured, using mock data');
      const mockData = mockMaintenanceData[actualPath] || { is_maintenance: false, maintenance_message: null };
      return NextResponse.json({
        ...mockData,
        mock: true,
        message: 'Using mock data - Supabase not configured'
      });
    }

    // Try database check with proper error handling
    try {
      console.log('🔧 Attempting database maintenance check...');
      
      const { data, error } = await supabase.rpc('get_page_maintenance_status', {
        page_path_param: actualPath
      });

      if (error) {
        console.error('❌ Database RPC error:', error);
        // Fallback to mock data
        const mockData = mockMaintenanceData[actualPath] || { is_maintenance: false, maintenance_message: null };
        return NextResponse.json({
          ...mockData,
          fallback: true,
          error: error.message
        });
      }

      console.log('✅ Database response:', data);

      // If no data found, assume page is not in maintenance
      if (!data || data.length === 0) {
        console.log('📝 No maintenance data found, defaulting to not in maintenance');
        return NextResponse.json({
          is_maintenance: false,
          maintenance_message: null
        });
      }

      return NextResponse.json({
        is_maintenance: data[0].is_maintenance,
        maintenance_message: data[0].maintenance_message
      });
    } catch (dbError) {
      console.error('❌ Database connection error:', dbError);
      
      // Fallback to mock data
      const mockData = mockMaintenanceData[actualPath] || { is_maintenance: false, maintenance_message: null };
      return NextResponse.json({
        ...mockData,
        fallback: true,
        error: dbError instanceof Error ? dbError.message : 'Database connection failed'
      });
    }
  } catch (error) {
    console.error('❌ Unexpected error in maintenance check:', error);
    
    // Fallback: return not in maintenance if anything fails (fail-safe)
    return NextResponse.json({
      is_maintenance: false,
      maintenance_message: null,
      fallback: true,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
