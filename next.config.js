const withPWA = require('next-pwa')({
	dest: 'public',
	// disable: process.env.NODE_ENV === 'development',
	disable: true,
	// register: true,
	// scope: '/app',
	// sw: 'service-worker.js',
	//...
})

// const withTM = require('next-transpile-modules')(['react-markdown']);
// const withTM = require('next-transpile-modules')([
//   'react-dnd',
//   'react-dnd-html5-backend',
// ]);

// module.exports = withTM({ webpack5: false });

// module.exports = withTM(withPWA({
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
	// future: { webpack5: true },
});
