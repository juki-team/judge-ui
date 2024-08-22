import { Analytics } from '@vercel/analytics/react';
import { CustomHead, ErrorBoundary, JukiProviders, NavigationBar, SpinIcon, T } from 'components';
import { jukiSettings } from 'config';
import {
  JUKI_APP_COMPANY_KEY,
  JUKI_SERVICE_BASE_URL,
  JUKI_SOCKET_BASE_URL,
  JUKI_TOKEN_NAME,
  NODE_ENV,
  ROUTES,
} from 'config/constants';
import { consoleWarn } from 'helpers';
import { useJukiUser } from 'hooks';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { _setFlags, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { AdminTab, AppProps, FC, ImageCmpProps, Judge, LastPathKey, QueryParam } from 'types';
import { useRouter } from '../hooks/useRouter';
import { useSearchParams } from '../hooks/useSearchParams';
import i18nInstance from '../i18n';
import './styles.scss';

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
};

export default function MyApp({ Component, pageProps, router }: AppProps) {
  
  jukiSettings.setOnError((error: any) => {
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
  }, []);
  
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
      socketServiceUrl={JUKI_SOCKET_BASE_URL}
      i18n={i18nInstance}
      initialLastPath={{
        [LastPathKey.SECTION_CONTEST]: {
          pathname: jukiSettings.ROUTES.contests().list(),
          searchParams: new URLSearchParams(''),
        },
        [LastPathKey.CONTESTS]: {
          pathname: jukiSettings.ROUTES.contests().list(),
          searchParams: new URLSearchParams(),
        },
        [LastPathKey.SECTION_PROBLEM]: {
          pathname: jukiSettings.ROUTES.problems().list(),
          searchParams: new URLSearchParams(),
        },
        [LastPathKey.PROBLEMS]: {
          pathname: jukiSettings.ROUTES.problems().list(),
          searchParams: new URLSearchParams({ [QueryParam.JUDGE]: Judge.CUSTOMER }),
        },
        [LastPathKey.SECTION_ADMIN]: {
          pathname: ROUTES.ADMIN.PAGE(AdminTab.SUBMISSIONS),
          searchParams: new URLSearchParams(),
        },
        [LastPathKey.SECTION_HELP]: { pathname: `/help`, searchParams: new URLSearchParams() },
      }}
    >
      {/*<ColorsModal />*/}
      <CustomHead />
      <UserProvider>
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
      </UserProvider>
      <SponsoredByTag />
    </JukiProviders>
  );
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary reload={reload}>{app}</ErrorBoundary>;
}
