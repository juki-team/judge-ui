import withPlugins from 'next-compose-plugins';
// import BundleAnalyzer from '@next/bundle-analyzer';

// const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = withPlugins([
  // PWA({
  //   dest: 'public',
  //   disable: isDev,
  //   register: true,
  //   skipWaiting: true,
  //   // scope: '/app',
  //   sw: 'service-worker.js',
  //   importScripts: [ '/worker.js' ],
  // }),
  // BundleAnalyzer({
  //   enabled: process.env.ANALYZE === 'true',
  // }),
], {
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
});

export default nextConfig;
