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
    return [
      { source: '/api/live/:path*', destination: `${process.env.NEXT_PUBLIC_LIVE_SERVICE_URL || 'http://localhost:3001'}/api/live/:path*` },
      { source: '/api/chat/:path*', destination: `${process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || 'http://localhost:3002'}/api/chat/:path*` },
      { source: '/api/auth/:path*', destination: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/:path*` }
    ];
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