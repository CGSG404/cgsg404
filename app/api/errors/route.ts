import { NextRequest, NextResponse } from 'next/server';

// Error reporting endpoint for production
export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();
    
    // Log error with timestamp
    const logEntry = {
      ...errorData,
      timestamp: new Date().toISOString(),
      severity: 'error',
      source: 'client'
    };
    
    // In production, you would send this to your error tracking service
    // For now, we'll log it securely
    console.error('🚨 Client Error Report:', {
      message: logEntry.message,
      url: logEntry.url,
      timestamp: logEntry.timestamp,
      userAgent: logEntry.userAgent?.substring(0, 100) // Truncate for security
    });
    
    // Store in database for analysis (optional)
    // await supabase.from('error_logs').insert(logEntry);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error reporting endpoint failed:', error);
    return NextResponse.json({ error: 'Failed to report error' }, { status: 500 });
  }
}
