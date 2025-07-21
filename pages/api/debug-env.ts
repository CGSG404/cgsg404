import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all environment variables (safely)
    const envVars = {
      // Public variables (safe to expose)
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      VERCEL: process.env.VERCEL || 'Not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
      
      // Private variables (only show if they exist, not the actual values)
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?
        `Present (${process.env.SUPABASE_SERVICE_ROLE_KEY.length} chars)` :
        'Not set',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?
        `Present (${process.env.SUPABASE_ANON_KEY.length} chars)` :
        'Not set',
      ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?
        `Present (${process.env.ENCRYPTION_KEY.length} chars)` :
        'Not set',
      
      // Additional debug info
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version,
    };

    console.log('🔍 Environment debug requested:', envVars);

    return res.status(200).json({
      success: true,
      environment: envVars,
      message: 'Environment variables checked successfully'
    });

  } catch (error) {
    console.error('Debug API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
