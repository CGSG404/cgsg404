import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for reliable data access (bypasses RLS for read operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Public endpoint for fetching casino reports
export async function GET() {
  try {
    console.log('📡 PUBLIC API: Fetching casino reports...');
    console.log('🔑 Using service role key for reliable access (bypasses RLS)');

    // Use service role to bypass RLS issues
    const { data: reports, error } = await supabase
      .from('casino_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ PUBLIC API Error fetching reports:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reports', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ PUBLIC API: Fetched ${reports?.length || 0} reports`);
    if (reports && reports.length > 0) {
      console.log('📋 Sample report:', reports[0]);
    }

    return NextResponse.json({
      success: true,
      data: reports || [],
      count: reports?.length || 0
    });

  } catch (error) {
    console.error('❌ PUBLIC API Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
