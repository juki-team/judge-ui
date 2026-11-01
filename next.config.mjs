/** @type {import('next').NextConfig} */
const nextConfig = {
  // the Dockerfile sets NEXT_OUTPUT=standalone to build a self-contained server
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  reactStrictMode: false,
  allowedDevOrigins: ['judge.local.juki.app'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.juki.pub',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'juki-judge.s3.us-east-2.amazonaws.com',
        pathname: '/public/user/image/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'judge.ohsansi.umss.edu.bo' }],
        destination: 'https://ohsansi.judge.juki.app/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
