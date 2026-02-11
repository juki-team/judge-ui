'use client';

import { ErrorBoundary, Image, InstallPWAModal, JukiProviders, NewVersionAvailable } from 'components';
import { jukiAppRoutes } from 'config';
import { NODE_ENV, ROUTES, SWR_CONFIG } from 'config/constants';
import { usePreloadComponents } from 'hooks';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { LastPathKey } from 'types';
import { useRouter } from '../../hooks/useRouter';
import { useSearchParams } from '../../hooks/useSearchParams';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false },
);

const initialLastPath = {
  [LastPathKey.CONTESTS]: '/contests',
  [LastPathKey.SECTION_CONTEST]: '/contests',
  [LastPathKey.PROBLEMS]: '/problems',
  [LastPathKey.SECTION_PROBLEM]: '/problems',
  [LastPathKey.BOARDS]: ROUTES.BOARDS.PAGE(),
  [LastPathKey.SECTION_HELP]: `/help`,
};

export const RootLayout = ({ children }: PropsWithChildren) => {
  
  const { isLoadingRoute, push, replace, refresh } = useRouter();
  const routeParams = useParams();
  const pathname = usePathname();
  const { searchParams, setSearchParams, deleteSearchParams, appendSearchParams } = useSearchParams();
  const preloaders = usePreloadComponents(5000);
  
  const loadingBasic = preloaders.atoms && preloaders.molecules && preloaders.organisms;
  
  const app = (
    <SWRConfig value={SWR_CONFIG}>
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
        onSeeMyProfile={(nickname, companyKey) => push(jukiAppRoutes.JUDGE().profiles.view({ nickname, companyKey }))}
      >
        {children}
        <NewVersionAvailable apiVersionUrl="/api/version" />
        <InstallPWAModal />
        <Analytics />
        {/*<NotificationWarningModal />*/}
        {/*<ScreenshotFrames />*/}
      </JukiProviders>
    </SWRConfig>
  );
  
  return NODE_ENV !== 'production' ? app : <ErrorBoundary reload={refresh}>{app}</ErrorBoundary>;
};
