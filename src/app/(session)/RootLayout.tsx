'use client';

import { Analytics } from '@vercel/analytics/react';
import {
  ErrorBoundary,
  Image,
  InstallPWAModal,
  JukiProviders,
  NavigationBar,
  NewVersionAvailable,
  T,
  ToolButtons,
} from 'components';
import { jukiAppRoutes } from 'config';
import { JUKI_APP_COMPANY_KEY, NODE_ENV, ROUTES } from 'config/constants';
import { usePreloadComponents, useUIStore, useUserStore } from 'hooks';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Children, type PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { LastPathKey } from 'types';
import { useRouter } from '../../hooks/useRouter';
import { useSearchParams } from '../../hooks/useSearchParams';

const SponsoredByTag = () => {
  
  const companyKey = useUserStore(state => state.company.key);
  const { Link } = useUIStore(store => store.components);
  
  if (companyKey === JUKI_APP_COMPANY_KEY) {
    return null;
  }
  
  return (
    <div className="sponsored-by bc-pd cr-pt">
      <T className="tt-se">sponsored by</T>&nbsp;
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
  
  const { isLoadingRoute, push, replace, refresh } = useRouter();
  const routeParams = useParams();
  const pathname = usePathname();
  const { searchParams, setSearchParams, deleteSearchParams, appendSearchParams } = useSearchParams();
  const preloaders = usePreloadComponents(5000);
  
  const loadingBasic = preloaders.atoms && preloaders.molecules && preloaders.organisms;
  
  const app = (
    <SWRConfig
      value={{
        revalidateIfStale: true, // when back to pages
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
        multiCompanies={false}
        onSeeMyProfile={(nickname) => push(jukiAppRoutes.JUDGE().profiles.view({ nickname }))}
      >
        <NavigationBar>
          {Children.toArray(children)}
          <SponsoredByTag />
          <ToolButtons />
        </NavigationBar>
        <Analytics key="analytics" />
        <NewVersionAvailable apiVersionUrl="/api/version" />
        <InstallPWAModal key="install-pwa-modal" />
        {/*<NotificationWarningModal />*/}
      </JukiProviders>
    </SWRConfig>
  );
  
  return NODE_ENV !== 'production' ? app : <ErrorBoundary reload={refresh}>{app}</ErrorBoundary>;
};
