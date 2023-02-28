import { Analytics } from '@vercel/analytics/react';
import { JukiUIProvider, JukiUserProvider, NavigationBar } from 'components';
import { settings } from 'config';
import { JUKI_SERVICE_BASE_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { consoleWarn } from 'helpers';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { _setFlags, TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import '../i18n';
import './styles.scss';

const MyComponent = dynamic(() => import('./md-print'), { ssr: false });

export default function MyApp({ Component, pageProps, router }) {
  
  settings.setSetting(JUKI_SERVICE_BASE_URL, 'api/v1', JUKI_SERVICE_BASE_URL, 'https://utils.juki.app', JUKI_TOKEN_NAME);
  settings.setOnError((error) => {
    consoleWarn(error);
    _setFlags.current(prevState => ({ ...prevState, isHelpOpen: true, isHelpFocused: true }));
    setTimeout(() => _setFlags.current(prevState => ({ ...prevState, isHelpFocused: false })), 2000);
  });
  
  if (router.route === '/md-print') {
    return <div><MyComponent {...pageProps} /></div>;
  }
  
  return (
    <JukiUIProvider>
      <JukiUserProvider
        utilsServiceUrl={JUKI_SERVICE_BASE_URL}
        utilsServiceApiVersion="api/v1"
        utilsUiUrl="https://utils.juki.app"
        tokenName={JUKI_TOKEN_NAME}
        utilsSocketServiceUrl={JUKI_SERVICE_BASE_URL}
      >
        <div className="jk-app">
          <Head>
            <title>Juki Judge App</title>
          </Head>
          <UserProvider>
            <TaskProvider>
              <SWRConfig
                value={{
                  revalidateIfStale: true, // when back to pages
                  revalidateOnFocus: false,
                  revalidateOnReconnect: false,
                }}
              >
                <NavigationBar>
                  <Analytics />
                  <Component {...pageProps} />
                </NavigationBar>
              </SWRConfig>
            </TaskProvider>
          </UserProvider>
        </div>
      </JukiUserProvider>
    </JukiUIProvider>
  );
}
