import { SpinIcon } from 'components';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import './styles.scss';
import 'diff2html/bundles/css/diff2html.min.css';

const inter = Inter({
  weight: [ '100', '200', '300', '500', '700' ],
  subsets: [ 'latin' ],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: 'Juki Judge | %s',
    default: 'Juki Judge',
  },
  description: 'Juki Judge is designed to make people improve their programming skills',
  applicationName: 'Juki Judge',
  keywords: [ 'Juki Judge' ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    title: 'Juki Judge',
    description: 'Juki Judge is designed to make people improve their programming skills',
    siteName: 'Juki Judge',
    url: 'https://judge.juki.app',
    images: [
      {
        url: 'https://images.juki.pub/assets/juki-judge-court.png',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Juki Judge',
    description: 'Juki Judge is designed to make people improve their programming skills',
    // siteId: '1467726470533754880',
    creator: '@oscar_gauss',
    // creatorId: '1467726470533754880',
    images: [ 'https://images.juki.pub/assets/juki-judge-court.png' ], // Must be an absolute URL
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: [ 'oscargauss@juki.app', 'https://www.oscargauss.com' ],
    },
  },
  appleWebApp: {
    title: 'Juki Judge',
    statusBarStyle: 'default',
    startupImage: [
      '/icons/apple-touch-icon.png',
      // {
      //   url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
      //   media: '(device-width: 768px) and (device-height: 1024px)',
      // },
    ],
  },
};

export default async function Layout({ children }: { children: ReactNode }) {
  
  return (
    <html lang="en" className={inter.variable}>
    <body className="jk-theme-light">
    <iframe
      style={{ display: 'none' }} src="https://juki.app/jk-cross.html"
      className="juki-iframe-cross-domain"
    />
    <iframe
      style={{ display: 'none' }} src="https://utils.juki.app/jk-cross.html"
      className="juki-iframe-cross-domain"
    />
    <iframe
      style={{ display: 'none' }} src="https://coach.juki.app/jk-cross.html"
      className="juki-iframe-cross-domain"
    />
    <Suspense fallback={<SpinIcon />}>
      {children}
    </Suspense>
    </body>
    </html>
  );
}
