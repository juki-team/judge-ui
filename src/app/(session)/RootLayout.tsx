'use client';

import { Analytics } from '@vercel/analytics/react';
import {
  ErrorBoundary,
  Image,
  JukiProviders,
  NavigationBar,
  NewVersionAvailable,
  SubmissionModal,
  T,
  UserPreviewModal,
} from 'components';
import { jukiApiSocketManager } from 'config';
import {
  JUKI_APP_COMPANY_KEY,
  JUKI_SERVICE_V1_URL,
  JUKI_SERVICE_V2_URL,
  JUKI_SOCKET_BASE_URL,
  JUKI_TOKEN_NAME,
  NODE_ENV,
  ROUTES,
} from 'config/constants';
import { useJukiUI, usePreloadComponents, useUserStore } from 'hooks';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { Children, PropsWithChildren } from 'react';
import { UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { LastPathKey } from 'types';
import { useRouter } from '../../hooks/useRouter';
import { useSearchParams } from '../../hooks/useSearchParams';

const SponsoredByTag = () => {
  
  const companyKey = useUserStore(state => state.company.key);
  const { components: { Link } } = useJukiUI();
  
  if (companyKey === JUKI_APP_COMPANY_KEY) {
    return null;
  }
  
  return (
    <div className="sponsored-by">
      <T>sponsored by</T>&nbsp;
      <Link href="https://juki.app" target="_blank" rel="noreferrer">Juki.app</Link>
    </div>
  );
};

const initialLastPath = {
  [LastPathKey.CONTESTS]: '/contests',
  [LastPathKey.SECTION_CONTEST]: '/contests',
  [LastPathKey.PROBLEMS]: '/problems',
  [LastPathKey.SECTION_PROBLEM]: '/problems',
  [LastPathKey.BOARDS]: ROUTES.BOARDS.PAGE(),
  [LastPathKey.SECTION_HELP]: `/help`,
};

export const RootLayout = ({ children }: PropsWithChildren<{}>) => {
  
  jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
  jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);
  
  const { isLoadingRoute, push, replace, refresh } = useRouter();
  const routeParams = useParams();
  const pathname = usePathname();
  const { searchParams, setSearchParams, deleteSearchParams, appendSearchParams } = useSearchParams();
  const preloaders = usePreloadComponents();
  
  const loadingBasic = preloaders.atoms && preloaders.atomsIconsGoogle && preloaders.atomsIconsSigns && preloaders.atomsIconsSpecials && preloaders.atomsImages
    && preloaders.molecules
    && preloaders.organisms
    && preloaders.templates;
  
  const app = (
    <SWRConfig
      value={{
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      <JukiProviders
        components={{ Image, Link }}
        router={{
          searchParams,
          setSearchParams,
          deleteSearchParams,
          appendSearchParams,
          pathname,
          routeParams,
          pushRoute: push,
          replaceRoute: replace,
          reloadRoute: refresh,
          isLoadingRoute: isLoadingRoute || !loadingBasic,
        }}
        initialLastPath={initialLastPath}
      >
        <UserProvider>
          <NavigationBar>
            {Children.toArray(children)}
            <SponsoredByTag />
          </NavigationBar>
        </UserProvider>
        <Analytics key="analytics" />
        <NewVersionAvailable apiVersionUrl="/api/version" />
        <UserPreviewModal key="user-preview-modal" />
        <SubmissionModal key="submission-modal" />
        {/*<JukiSocketAlert />*/}
      </JukiProviders>
    </SWRConfig>
  );
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary reload={refresh}>{app}</ErrorBoundary>;
};
