const { version } = require('./package.json');
const { withPlugins, optional } = require('next-compose-plugins');
const { Language } = require('@juki-team/commons'); // required
const PWA = require('next-pwa');
const BundleAnalyzer = require('@next/bundle-analyzer');

module.exports = withPlugins([
  PWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    // register: true,
    // scope: '/app',
    sw: 'service-worker.js',
    importScripts: [ '/worker.js' ],
  }),
  BundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  }),
], {
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
      child_process: false,
      tls: false,
      bufferutil: false,
      'utf-8-validate': false,
    };
    
    return config;
  },
  publicRuntimeConfig: {
    version,
  },
  // output:"standalone",
  // i18n: {
  //   locales: [ Language.EN.toLowerCase(), Language.ES.toLowerCase() ],
  //   defaultLocale: Language.EN.toLowerCase(),
  // },
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
  async redirects() {
    return [
      // {
      //   source: '/admin',
      //   destination: '/admin/users-management',
      //   permanent: true,
      // },
    ];
  },
});
