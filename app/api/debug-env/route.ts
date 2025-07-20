import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
    serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    // Don't expose actual values for security
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || key.includes('NEXT_PUBLIC')
    )
  });
}
