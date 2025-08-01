import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔧 Admin Casino API: GET single casino', params.id);
    
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('casinos')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('❌ Supabase query error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database query failed: ${error.message}` 
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Casino not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: data
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔧 Admin Casino API: PUT request for casino', params.id);
    
    // Parse request body
    const updates = await request.json();
    console.log('🔍 Update data received:', updates);
    
    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();
    
    // Ensure rating is a number if provided
    if (updates.rating && typeof updates.rating === 'string') {
      updates.rating = parseFloat(updates.rating);
    }
    
    // Validate rating range if provided
    if (updates.rating !== undefined && (updates.rating < 0 || updates.rating > 5)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Rating must be between 0 and 5' 
        },
        { status: 400 }
      );
    }
    
    // Validate safety index if provided
    if (updates.safety_index) {
      const validSafetyIndexes = ['Low', 'Medium', 'High', 'Very High'];
      if (!validSafetyIndexes.includes(updates.safety_index)) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Safety index must be one of: ${validSafetyIndexes.join(', ')}` 
          },
          { status: 400 }
        );
      }
    }
    
    console.log('✅ Validation passed, updating casino...');
    
    // Update casino using service role (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('casinos')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database update failed: ${error.message}`,
          code: error.code 
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Casino not found' 
        },
        { status: 404 }
      );
    }
    
    console.log('✅ Casino updated successfully:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Casino updated successfully',
      data: data
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔧 Admin Casino API: DELETE request for casino', params.id);
    
    // Delete casino using service role (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('casinos')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('❌ Supabase delete error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database delete failed: ${error.message}`,
          code: error.code 
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Casino deleted successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Casino deleted successfully'
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
