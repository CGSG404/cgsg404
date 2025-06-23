export const env = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Neon Casino Guide',
    VITE_APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    VITE_ENABLE_MAINTENANCE: import.meta.env.VITE_ENABLE_MAINTENANCE === 'true',
  } as const;
  
  // Validate required environment variables in production
  if (import.meta.env.PROD) {
    const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
    const missingVars = requiredVars.filter((key) => !import.meta.env[key]);
  
    if (missingVars.length > 0) {
      console.error(
        'Missing required environment variables:', 
        missingVars.join('\n')
      );
      throw new Error('Missing required environment variables');
    }
  }
  