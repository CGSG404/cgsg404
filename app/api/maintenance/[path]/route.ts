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

    try {
      const { data, error } = await supabase.rpc('get_page_maintenance_status', {
        page_path_param: actualPath
      });

      if (error) {
        console.error('❌ Database RPC error:', error);
        
        // Fallback: return not in maintenance if database fails
        return NextResponse.json({
          is_maintenance: false,
          maintenance_message: null,
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
      
      // Fallback: return not in maintenance if database fails (fail-safe)
      return NextResponse.json({
        is_maintenance: false,
        maintenance_message: null,
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
