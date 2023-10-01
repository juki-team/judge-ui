import { JUKI_APP_COMPANY_KEY } from '@juki-team/commons';
import { Analytics } from '@vercel/analytics/react';
import { CustomHead, ErrorBoundary, JukiUIProvider, JukiUserProvider, LineLoader, NavigationBar, T } from 'components';
import { settings } from 'config';
import { JUKI_SERVICE_BASE_URL, JUKI_TOKEN_NAME, NODE_ENV } from 'config/constants';
import { consoleWarn } from 'helpers';
import { useJukiUser, useRouter } from 'hooks';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { _setFlags, TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { AppProps, FC, ImageCmpProps } from 'types';
import { useSearchParams } from '../hooks/useSearchParams';
import '../i18n';
import './styles.scss';

const MyComponent = dynamic(() => import('./md-print'), { ssr: false });

const SponsoredByTag = () => {
  
  const { company: { key } } = useJukiUser();
  
  if (key === JUKI_APP_COMPANY_KEY) {
    return null;
  }
  
  return (
    <div className="sponsored-by">
      <T>sponsored by</T>&nbsp;
      <a href="https://juki.app" target="_blank" rel="noreferrer">Juki.app</a>
    </div>
  );
}

export default function MyApp({ Component, pageProps, router }: AppProps) {
  
  settings.setSetting(
    JUKI_SERVICE_BASE_URL,
    'api/v1',
    JUKI_SERVICE_BASE_URL,
    'https://utils.juki.app',
    JUKI_TOKEN_NAME,
  );
  settings.setOnError((error) => {
    consoleWarn(error);
    _setFlags.current(prevState => ({ ...prevState, isHelpOpen: true, isHelpFocused: true }));
    setTimeout(() => _setFlags.current(prevState => ({ ...prevState, isHelpFocused: false })), 2000);
  });
  
  const { isLoading, reload } = useRouter();
  const { searchParams, setSearchParams, appendSearchParams, deleteSearchParams } = useSearchParams();
  
  if (router.route === '/md-print') {
    return <div><MyComponent {...pageProps} /></div>;
  }
  
  const app = (
    <JukiUIProvider
      components={{ Image: Image as FC<ImageCmpProps>, Link: Link }}
      router={{ searchParams, setSearchParams, deleteSearchParams, appendSearchParams }}
    >
      <JukiUserProvider
        utilsServiceUrl={JUKI_SERVICE_BASE_URL}
        utilsServiceApiVersion="api/v1"
        utilsUiUrl="https://utils.juki.app"
        tokenName={JUKI_TOKEN_NAME}
        utilsSocketServiceUrl={JUKI_SERVICE_BASE_URL}
      >
        <div className="jk-app">
          {isLoading && <div className="page-line-loader"><LineLoader delay={3} /></div>}
          <CustomHead />
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
          <SponsoredByTag />
        </div>
      </JukiUserProvider>
    </JukiUIProvider>
  );
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary reload={reload}>{app}</ErrorBoundary>;
}
