/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'].concat(
    process.env.NODE_ENV === 'production' ? [] : ['tsx', 'ts', 'jsx', 'js']
  ),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
