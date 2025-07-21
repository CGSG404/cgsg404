import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.gurusingapore.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET /api/casinos
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get casinos from database
    const { data: casinos, error } = await supabase
      .from('casinos')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching casinos:', error);
      return NextResponse.json(
        { error: 'Failed to fetch casinos' },
        { 
          status: 500,
          headers: corsHeaders 
        }
      );
    }

    return NextResponse.json(
      { casinos: casinos || [] },
      { 
        status: 200,
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}

// POST /api/casinos (for admin)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check if user is admin (you might want to add proper auth check here)
    const body = await request.json();
    
    const { data: casino, error } = await supabase
      .from('casinos')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating casino:', error);
      return NextResponse.json(
        { error: 'Failed to create casino' },
        { 
          status: 500,
          headers: corsHeaders 
        }
      );
    }

    return NextResponse.json(
      { casino },
      { 
        status: 201,
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}
