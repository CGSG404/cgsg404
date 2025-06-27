// src/test/env.ts  (versi Next.js)
export const env = {
  NEXT_PUBLIC_SUPABASE_URL:        process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  NEXT_PUBLIC_SENTRY_DSN:          process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_APP_ENV:             process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  NEXT_PUBLIC_APP_NAME:            process.env.NEXT_PUBLIC_APP_NAME ?? 'Neon Casino Guide',
  NEXT_PUBLIC_APP_URL:             process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  NEXT_PUBLIC_ENABLE_ANALYTICS:    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  NEXT_PUBLIC_ENABLE_MAINTENANCE:  process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE === 'true',
} as const

// Validasi di production
if (process.env.NODE_ENV === 'production') {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ] as const

  const missing = requiredVars.filter((key) => !process.env[key])

  if (missing.length) {
    console.error('Missing required env vars:\n' + missing.join('\n'))
    throw new Error('Missing required environment variables')
  }
}
