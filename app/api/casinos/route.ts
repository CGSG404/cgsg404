import { NextRequest, NextResponse } from 'next/server';
// Temporarily disable supabase import to fix ChunkLoadError
// import { supabaseServer } from '@/src/lib/supabaseServer';

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

// GET /api/casinos - Temporarily simplified to fix ChunkLoadError
export async function GET(request: NextRequest) {
  try {
    // Return mock data for now to avoid Supabase connection issues
    const mockCasinos = [
      {
        id: 1,
        name: "Demo Casino",
        rating: 4.5,
        status: "active",
        created_at: new Date().toISOString()
      }
    ];

    return NextResponse.json(
      { casinos: mockCasinos },
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

// POST /api/casinos (for admin) - Temporarily simplified
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Return mock response for now
    const mockCasino = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString()
    };

    return NextResponse.json(
      { casino: mockCasino },
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
