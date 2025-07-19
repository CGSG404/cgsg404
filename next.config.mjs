/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ultra minimal configuration for maximum Vercel compatibility
  reactStrictMode: false,
};

export default nextConfig;
