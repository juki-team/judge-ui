import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import Loading from './loading';
import { RootLayout } from './RootLayout';
import './styles.scss';

// TODO:
const inter = Inter({
  weight: [ '100', '200', '300', '500', '700' ],
  subsets: [ 'latin' ],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Juki Judge',
  description: 'Welcome to Juki Judge',
};

export default async function Layout({
                                       children,
                                     }: {
  children: ReactNode
}) {
  
  // jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);
  // const { company } = useJukiUser();
  // const customTitle = `${company.name ? company.name : 'Juki'}  judge${title ? ' - ' + title : ''}`;
  // const customDescription = `${description ? description : 'Juki Judge is designed to make people improve their programming skills'}`;
  
  const customTitle = 'Juki Judge';
  const customDescription = 'Juki Judge is designed to make people improve their programming skills';
  // TODO: update metadata with https://nextjs.org/docs/app/api-reference/functions/generate-metadata
  
  return (
    <html lang="en" className={inter.variable}>
    <head>
      <title>{customTitle}</title>
      
      <meta name="keywords" content="Juki Judge" />
      <meta name="application-name" content={customTitle} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={customTitle} />
      <meta name="description" content={customDescription} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileImage" content="/icons/ios/144.png" />
      <meta name="msapplication-TileColor" content="#164066" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#FFFFFF" />
      
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://judge.juki.app" />
      <meta name="twitter:title" content={customTitle} />
      <meta name="twitter:description" content={customDescription} />
      <meta name="twitter:image" content="https://judge.juki.app/icons/ios/192.png" />
      <meta name="twitter:creator" content="@oscar_gauss" />
      
      <meta property="og:type" content="website" />
      <meta property="og:title" content={customTitle} />
      <meta property="og:description" content={customDescription} />
      <meta property="og:site_name" content={customTitle} />
      <meta property="og:url" content="https://judge.juki.app" />
      <meta property="og:image" content="https://judge.juki.app/icons/apple-touch-icon.png" />
    </head>
    <body>
    <iframe
      style={{ display: 'none' }} src="https://utils.juki.app/jk-cross.html"
      className="juki-iframe-cross-domain"
    />
    <Suspense fallback={<Loading />}>
      <RootLayout>
        {children}
      </RootLayout>
    </Suspense>
    </body>
    </html>
  );
}
