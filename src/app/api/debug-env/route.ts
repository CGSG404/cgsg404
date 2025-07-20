import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Debug: Log all environment variables that contain SUPABASE
    const allEnvKeys = Object.keys(process.env);
    const supabaseKeys = allEnvKeys.filter(key => key.includes('SUPABASE'));

    console.log('🔍 All environment keys:', allEnvKeys.length);
    console.log('🔍 Supabase-related keys:', supabaseKeys);
    console.log('🔍 NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔍 SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const envCheck = {
      status: 'API route working',
      timestamp: new Date().toISOString(),
      totalEnvVars: allEnvKeys.length,
      supabaseRelatedKeys: supabaseKeys,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
      nodeEnv: process.env.NODE_ENV || 'undefined',
      vercelEnv: process.env.VERCEL_ENV || 'undefined',
      // Show first few characters for verification (but not full keys for security)
      supabaseUrlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL ?
        process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...' : 'N/A',
      serviceRoleKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY ?
        process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'N/A',
    };

    console.log('🔍 Environment check result:', envCheck);

    return NextResponse.json(envCheck);
  } catch (error) {
    console.error('❌ Debug env error:', error);
    return NextResponse.json(
      {
        error: 'Failed to check environment',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      },
      { status: 500 }
    );
  }
}
