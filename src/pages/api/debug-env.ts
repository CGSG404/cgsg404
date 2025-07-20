import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
      nodeEnv: process.env.NODE_ENV || 'undefined',
      vercelEnv: process.env.VERCEL_ENV || 'undefined',
      timestamp: new Date().toISOString(),
      // Show first few characters for verification (but not full keys for security)
      supabaseUrlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
        process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...' : 'N/A',
      serviceRoleKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
        process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'N/A',
    };

    console.log('🔍 Environment check:', envCheck);

    res.status(200).json(envCheck);
  } catch (error) {
    console.error('❌ Debug env error:', error);
    res.status(500).json({ 
      error: 'Failed to check environment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
