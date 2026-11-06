import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Product photos go through a Server Action; the API accepts up to 5 MB.
    serverActions: { bodySizeLimit: '6mb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Catalogue photos the API passes through as absolute URLs (seed uses Unsplash).
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
