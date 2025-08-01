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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔧 Admin Casino API: PATCH status request for casino', params.id);
    
    // Parse request body
    const statusUpdates = await request.json();
    console.log('🔍 Status updates received:', statusUpdates);
    
    // Validate status fields
    const validStatusFields = ['is_featured', 'is_hot', 'is_new'];
    const invalidFields = Object.keys(statusUpdates).filter(field => !validStatusFields.includes(field));
    
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid status fields: ${invalidFields.join(', ')}. Valid fields: ${validStatusFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Validate boolean values
    for (const [field, value] of Object.entries(statusUpdates)) {
      if (typeof value !== 'boolean') {
        return NextResponse.json(
          { 
            success: false, 
            message: `Field '${field}' must be a boolean value` 
          },
          { status: 400 }
        );
      }
    }
    
    // Add updated_at timestamp
    const updates = {
      ...statusUpdates,
      updated_at: new Date().toISOString()
    };
    
    console.log('✅ Validation passed, updating casino status...');
    
    // Update casino status using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('casinos')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase status update error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database status update failed: ${error.message}`,
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
    
    console.log('✅ Casino status updated successfully:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Casino status updated successfully',
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
