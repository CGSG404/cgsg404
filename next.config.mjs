/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Development and Production optimizations
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable experimental features that might cause Vercel issues
  experimental: {
    // optimizeCss: true,
    // optimizePackageImports: [
    //   '@radix-ui/react-icons',
    //   '@radix-ui/react-components',
    //   'lucide-react',
    //   'date-fns',
    // ],
  },
};

export default nextConfig;
