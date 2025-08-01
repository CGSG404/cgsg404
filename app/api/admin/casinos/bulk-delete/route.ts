import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function DELETE(request: NextRequest) {
  try {
    console.log('🔧 Admin Casino API: Bulk DELETE request received');
    
    // Parse request body
    const { ids } = await request.json();
    console.log('🔍 Casino IDs to delete:', ids);
    
    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or empty IDs array' 
        },
        { status: 400 }
      );
    }
    
    // Validate all IDs are numbers
    const invalidIds = ids.filter(id => typeof id !== 'number' && !Number.isInteger(Number(id)));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid casino IDs: ${invalidIds.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    console.log('✅ Validation passed, bulk deleting casinos...');
    
    // Bulk delete casinos using service role (bypasses RLS)
    const { error } = await supabaseAdmin
      .from('casinos')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('❌ Supabase bulk delete error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database bulk delete failed: ${error.message}`,
          code: error.code 
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Casinos bulk deleted successfully');
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${ids.length} casino(s)`,
      deletedCount: ids.length
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
