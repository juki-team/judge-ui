const withPWA = require('next-pwa');
// const withTM = require('next-transpile-modules')(['react-markdown']);

module.exports = withPWA({
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/users',
        permanent: true,
      },
    ];
  },
  future: { webpack5: true },
  pwa: {
    dest: 'public',
    disable: process.env.NEXT_PUBLIC_NODE_ENV === 'development',
  },
});
