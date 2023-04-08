const withPWA = require('next-pwa')({
    dest: 'public',
    // disable: process.env.NODE_ENV === 'development',
    // register: true,
    // scope: '/app',
    sw: 'service-worker.js',
    importScripts: ['/worker.js']
});

module.exports = withPWA({
    i18n: {
        locales: ['en', 'es'],
        defaultLocale: 'en'
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.juki.pub',
                pathname: '/u/**'
            },
            {
                protocol: 'https',
                hostname: 'images.juki.pub',
                pathname: '/c/**'
            },
            {
                protocol: 'https',
                hostname: 'juki-judge.s3.us-east-2.amazonaws.com',
                pathname: '/public/user/image/**'
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/users-management',
                permanent: true,
            },
        ];
    }
    // future: { webpack5: true },
});
