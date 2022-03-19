const withPWA = require('next-pwa');

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
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
});
