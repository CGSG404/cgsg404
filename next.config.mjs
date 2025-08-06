/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Environment variables
  env: {
    // Disable console logging in production
    NEXT_PUBLIC_ENABLE_LOGGING: process.env.NODE_ENV === 'development' ? 'true' : 'false',
    NEXT_PUBLIC_LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  },

  // Performance optimizations for production
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@tanstack/react-query',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
      'recharts'
    ],
    optimizeCss: true,
    scrollRestoration: true,
    webpackBuildWorker: true,
  },

  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: false, // Enable Next.js image optimization
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  // Remove standalone output for development
  // output: 'standalone',
  // Optimized Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Basic module resolution fixes
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Production optimizations
    if (!dev) {
      // Enable tree shaking for CSS
      config.optimization.usedExports = true;
      
      // Optimize chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Common components chunk
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
          // Vendor chunk
          vendor: {
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `vendor-${packageName.replace('@', '')}`;
            },
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.gurusingapore.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, apikey',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Performance headers - Optimized caching strategy
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for static assets
          },
        ],
      },
      {
        source: '/auth/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.gurusingapore.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, apikey',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      // Optimized caching for static assets
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // HTML pages - shorter cache
      {
        source: '/(.*).html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
