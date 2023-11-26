import { SpinIcon } from '@juki-team/base-ui';
import { JUKI_APP_COMPANY_KEY } from '@juki-team/commons';
import { Analytics } from '@vercel/analytics/react';
import { CustomHead, ErrorBoundary, JukiProviders, LasLinkProvider, NavigationBar, T } from 'components';
import { settings } from 'config';
import { JUKI_SERVICE_BASE_URL, JUKI_TOKEN_NAME, NODE_ENV } from 'config/constants';
import { consoleWarn } from 'helpers';
import { useJukiUser } from 'hooks';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { _setFlags, TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { AppProps, FC, ImageCmpProps } from 'types';
import { useRouter } from '../hooks/useRouter';
import { useSearchParams } from '../hooks/useSearchParams';
import i18n from '../i18n';
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
    JUKI_SERVICE_BASE_URL + '/api/v1',
    JUKI_SERVICE_BASE_URL,
    'https://utils.juki.app',
    JUKI_TOKEN_NAME,
  );
  settings.setOnError((error) => {
    consoleWarn(error);
    _setFlags.current(prevState => ({ ...prevState, isHelpOpen: true, isHelpFocused: true }));
    setTimeout(() => _setFlags.current(prevState => ({ ...prevState, isHelpFocused: false })), 2000);
  });
  
  const { searchParams, setSearchParams, appendSearchParams, deleteSearchParams } = useSearchParams();
  const { asPath, routerParams, push, replace, reload, isReady, isLoadingRoute } = useRouter();
  const pathname = asPath.split('?')[0];
  const [ mounted, setMounted ] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [])
  
  if (router.route === '/md-print') {
    return <div><MyComponent {...pageProps} /></div>;
  }
  
  if (!isReady || !mounted) {
    return <div className="jk-col" style={{ height: 'var(--100VH)' }}><SpinIcon size="very-huge" /></div>;
  }
  
  const app = (
    <JukiProviders
      components={{ Image: Image as FC<ImageCmpProps>, Link: Link }}
      serviceApiUrl={JUKI_SERVICE_BASE_URL + '/api/v1'}
      utilsUiUrl="https://utils.juki.app"
      tokenName={JUKI_TOKEN_NAME}
      router={{
        searchParams,
        setSearchParams,
        deleteSearchParams,
        appendSearchParams,
        pathname,
        routeParams: routerParams,
        pushRoute: push,
        replaceRoute: replace,
        reloadRoute: reload,
        isLoadingRoute,
      }}
      socketServiceUrl={JUKI_SERVICE_BASE_URL}
      i18n={i18n}
    >
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
            <LasLinkProvider>
              <NavigationBar>
                <Analytics />
                <Component {...pageProps} />
              </NavigationBar>
            </LasLinkProvider>
          </SWRConfig>
        </TaskProvider>
      </UserProvider>
      <SponsoredByTag />
    </JukiProviders>
  );
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary reload={reload}>{app}</ErrorBoundary>;
}
