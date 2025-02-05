'use client';

import { Analytics } from '@vercel/analytics/react';
import {
  ErrorBoundary,
  JukiProviders,
  JukiSocketAlert,
  NavigationBar,
  NewVersionAvailableTrigger,
  SubmissionModal,
  T,
  UserPreviewModal,
} from 'components';
import { jukiApiSocketManager, jukiAppRoutes, jukiGlobalStore } from 'config';
import {
  JUKI_APP_COMPANY_KEY,
  JUKI_SERVICE_V1_URL,
  JUKI_SERVICE_V2_URL,
  JUKI_SOCKET_BASE_URL,
  JUKI_TOKEN_NAME,
  NODE_ENV,
  ROUTES,
} from 'config/constants';
import { useEffect, useJukiUI, useJukiUser, useState } from 'hooks';
import { createInstance, i18n } from 'i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { Children, PropsWithChildren } from 'react';
import { UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { FC, ImageCmpProps, Language, LastPathKey } from 'types';
import { useRouter } from '../hooks/useRouter';
import { useSearchParams } from '../hooks/useSearchParams';
import initTranslations from '../i18n/i18n';

const i18nInstance = createInstance() as i18n;

void initTranslations(i18nInstance);

const SponsoredByTag = () => {
  
  const { company: { key } } = useJukiUser();
  const { components: { Link } } = useJukiUI();
  
  if (key === JUKI_APP_COMPANY_KEY) {
    return null;
  }
  
  return (
    <div className="sponsored-by">
      <T>sponsored by</T>&nbsp;
      <Link href="https://juki.app" target="_blank" rel="noreferrer">Juki.app</Link>
    </div>
  );
};

export const RootLayout = ({ children }: PropsWithChildren<{}>) => {
  
  const [ _, setLanguage ] = useState<Language | undefined>();
  
  useEffect(() => {
    jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
    jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);
    void jukiGlobalStore.setI18n(i18nInstance);
    
    const handleLanguageChange = (lng: Language) => setLanguage(lng);
    
    i18nInstance.on('languageChanged', handleLanguageChange);
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
    
  }, []);
  
  const { isLoadingRoute, push, replace, refresh } = useRouter();
  const routeParams = useParams();
  const pathname = usePathname();
  const { searchParams, setSearchParams, deleteSearchParams, appendSearchParams } = useSearchParams();
  
  const app = (
    <SWRConfig
      value={{
        revalidateIfStale: true, // when back to pages
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 8,
        errorRetryInterval: 100,
        // shouldRetryOnError: (error) => {
        //   console.log('shouldRetryOnError', { error });
        //   return !error.message.includes('401');
        // },
        // onSuccess: (...props) => {
        //   console.log('onSuccess', props);
        // },
        // onError: (err, key) => {
        //   console.log('onError', { err, key });
        //   // Usar datos en caché si existe un error
        //   // const cachedData = SWRConfig.default.provider().get(key);
        //   // if (cachedData) mutate(key, cachedData, false);
        // },
      }}
    >
      <JukiProviders
        components={{ Image: Image as FC<ImageCmpProps>, Link: Link }}
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
          isLoadingRoute,
        }}
        initialLastPath={{
          [LastPathKey.SECTION_CONTEST]: {
            pathname: jukiAppRoutes.JUDGE().contests.list(),
            searchParams: new URLSearchParams(),
          },
          [LastPathKey.CONTESTS]: {
            pathname: jukiAppRoutes.JUDGE().contests.list(),
            searchParams: new URLSearchParams(),
          },
          [LastPathKey.SECTION_PROBLEM]: {
            pathname: jukiAppRoutes.JUDGE().problems.list(),
            searchParams: new URLSearchParams(),
          },
          [LastPathKey.PROBLEMS]: {
            pathname: jukiAppRoutes.JUDGE().problems.list(),
            searchParams: new URLSearchParams(),
          },
          [LastPathKey.BOARDS]: {
            pathname: ROUTES.BOARDS.PAGE(),
            searchParams: new URLSearchParams(),
          },
          [LastPathKey.SECTION_HELP]: { pathname: `/help`, searchParams: new URLSearchParams() },
        }}
      >
        <UserProvider>
          <NewVersionAvailableTrigger apiVersionUrl="/api/version" />
          <NavigationBar>
            <Analytics key="analytics" />
            {Children.toArray(children)}
            <UserPreviewModal key="user-preview-modal" />
            <SubmissionModal key="submission-modal" />
          </NavigationBar>
          <JukiSocketAlert />
          <SponsoredByTag />
        </UserProvider>
      </JukiProviders>
    </SWRConfig>
  );
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary reload={refresh}>{app}</ErrorBoundary>;
};
