import { JukiI18nInitializer } from 'components';
import { DEFAULT_METADATA } from 'config/constants';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './styles.scss';
import '@juki-team/base-ui/styles.scss';

const inter = Inter({
  weight: [ '100', '200', '300', '500', '700' ],
  subsets: [ 'latin' ],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata: Metadata = DEFAULT_METADATA;

const StylesLazy = dynamic(() => import('./Styles'), {
  ssr: false,
  loading: () => null,
});

export default async function Layout({ children }: { children: ReactNode }) {
  
  return (
    <html lang="en" className={inter.variable}>
    <body className="jk-theme-light">
    <iframe
      style={{ display: 'none' }} src="https://www.juki.app/jk-cross.html"
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
    {children}
    <JukiI18nInitializer />
    <StylesLazy />
    </body>
    </html>
  );
}
