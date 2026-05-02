import withPlugins from 'next-compose-plugins';

const nextConfig = withPlugins([], {
  reactStrictMode: false,
  transpilePackages: [ '@juki-team/base-ui' ],
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
  allowedDevOrigins: [ 'judge.local.juki.app' ],
});

export default nextConfig;
