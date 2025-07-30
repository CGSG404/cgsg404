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
async function verifyAdminAuth() {
  try {
    // Production: Full authentication required

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      return { error: 'Admin access required', status: 403 };
    }

    return { user, adminData };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

// GET - Admin endpoint for fetching casino reports
export async function GET() {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    console.log('📡 Admin fetching casino reports...');

    const { data: reports, error } = await supabaseAdmin
      .from('casino_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching reports:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reports', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Admin fetched ${reports?.length || 0} reports`);
    
    return NextResponse.json({
      success: true,
      data: reports || [],
      count: reports?.length || 0
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new casino report
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { casino_name, status, last_reported, summary, url } = body;

    // Validate required fields
    if (!casino_name || !status || !last_reported || !summary) {
      return NextResponse.json(
        { error: 'Missing required fields: casino_name, status, last_reported, summary' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['Unlicensed', 'Scam Indicated', 'Many Users Reported'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('📝 Creating new casino report:', { casino_name, status });

    // Use service role key to bypass RLS for admin operations
    const { data: newReport, error } = await supabaseAdmin
      .from('casino_reports')
      .insert({
        casino_name,
        status,
        last_reported,
        summary,
        url: url || '#'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating report:', error);
      return NextResponse.json(
        { error: 'Failed to create report', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Report created successfully:', newReport);
    
    return NextResponse.json({
      success: true,
      message: 'Report created successfully',
      data: newReport
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing casino report
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { id, casino_name, status, last_reported, summary, url } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

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
