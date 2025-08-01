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

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Admin Casino API: POST request received');
    
    // Parse request body
    const casinoData = await request.json();
    console.log('🔍 Casino data received:', casinoData);
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'logo', 'rating', 'safety_index', 'bonus', 'description', 'play_url'];
    const missingFields = requiredFields.filter(field => !casinoData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Ensure rating is a number
    if (typeof casinoData.rating === 'string') {
      casinoData.rating = parseFloat(casinoData.rating);
    }
    
    // Validate rating range
    if (casinoData.rating < 0 || casinoData.rating > 5) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Rating must be between 0 and 5' 
        },
        { status: 400 }
      );
    }
    
    // Validate safety index
    const validSafetyIndexes = ['Low', 'Medium', 'High', 'Very High'];
    if (!validSafetyIndexes.includes(casinoData.safety_index)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Safety index must be one of: ${validSafetyIndexes.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    console.log('✅ Validation passed, inserting casino...');
    
    // Insert casino using service role (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('casinos')
      .insert([casinoData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: `Database insert failed: ${error.message}`,
          code: error.code 
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Casino created successfully:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Casino created successfully',
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

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Admin Casino API: GET request received');
    
    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query
    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin
      .from('casinos')
      .select('*', { count: 'exact' });
    
    // Add search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
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
    
    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
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
