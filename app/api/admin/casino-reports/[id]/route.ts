import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin Supabase client for write operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Auth client for user verification
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Authentication middleware
async function verifyAdminAuth(request: NextRequest) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header found');
      return { error: 'Unauthorized', status: 401 };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      console.log('❌ Token verification failed:', authError?.message);
      return { error: 'Unauthorized', status: 401 };
    }

    console.log('✅ User authenticated:', user.email);

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      console.log('❌ User is not admin:', user.email);
      return { error: 'Admin access required', status: 403 };
    }

    console.log('✅ Admin access verified:', user.email);
    return { user, adminData };
  } catch (error) {
    console.error('❌ Auth verification error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

// GET - Get specific casino report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = params;
    console.log('📡 Fetching casino report:', id);

    const { data: report, error } = await supabaseAdmin
      .from('casino_reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching report:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch report', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Report fetched successfully:', report);
    
    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update specific casino report
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = params;
    const body = await request.json();
    const { casino_name, status, last_reported, summary, url } = body;

    // Validate status if provided
    if (status) {
      const validStatuses = ['Unlicensed', 'Scam Indicated', 'Many Users Reported'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    console.log('📝 Updating casino report:', id);

    // Build update object with only provided fields
    const updateData: any = {};
    if (casino_name) updateData.casino_name = casino_name;
    if (status) updateData.status = status;
    if (last_reported) updateData.last_reported = last_reported;
    if (summary) updateData.summary = summary;
    if (url !== undefined) updateData.url = url;

    const { data: updatedReport, error } = await supabaseAdmin
      .from('casino_reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating report:', error);
      return NextResponse.json(
        { error: 'Failed to update report', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Report updated successfully:', updatedReport);
    
    return NextResponse.json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific casino report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = params;
    console.log('🗑️ Deleting casino report:', id);

    // First check if the report exists
    const { data: existingReport, error: checkError } = await supabaseAdmin
      .from('casino_reports')
      .select('id, casino_name')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('❌ Error checking report existence:', checkError);
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          message: 'Report already deleted or does not exist'
        }, { status: 200 });
      }
      return NextResponse.json({
        error: 'Error checking report existence',
        details: checkError.message
      }, { status: 500 });
    }

    console.log('✅ Report found, proceeding with deletion:', existingReport);

    // Delete the report
    const { data: deletedData, error: deleteError } = await supabaseAdmin
      .from('casino_reports')
      .delete()
      .eq('id', id)
      .select();

    if (deleteError) {
      console.error('❌ Error deleting report:', deleteError);
      return NextResponse.json({
        error: 'Failed to delete report',
        details: deleteError.message
      }, { status: 500 });
    }

    if (!deletedData || deletedData.length === 0) {
      console.error('❌ No rows were deleted for ID:', id);
      return NextResponse.json({
        error: 'No rows were deleted. Report may not exist.'
      }, { status: 404 });
    }

    console.log('✅ Report deleted successfully:', deletedData[0]);
    
    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
      deletedReport: deletedData[0]
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
