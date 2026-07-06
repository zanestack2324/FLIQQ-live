/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' }
    ],
    formats: ['image/avif', 'image/webp']
  },
  async rewrites() {
    const rewrites = [];
    if (process.env.NEXT_PUBLIC_LIVE_SERVICE_URL) {
      rewrites.push({ source: '/api/live/:path*', destination: `${process.env.NEXT_PUBLIC_LIVE_SERVICE_URL}/api/live/:path*` });
    }
    if (process.env.NEXT_PUBLIC_CHAT_SERVICE_URL) {
      rewrites.push({ source: '/api/chat/:path*', destination: `${process.env.NEXT_PUBLIC_CHAT_SERVICE_URL}/api/chat/:path*` });
    }
    return rewrites;
  },
  webpack(config) {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil'
    });
    return config;
  }
};

module.exports = nextConfig;