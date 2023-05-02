import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary, JukiUIProvider, JukiUserProvider, NavigationBar } from 'components';
import { settings } from 'config';
import { JUKI_SERVICE_BASE_URL, JUKI_TOKEN_NAME, NODE_ENV } from 'config/constants';
import { consoleWarn } from 'helpers';
import { useRouter } from 'hooks';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useCallback, useMemo } from 'react';
import { _setFlags, TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { ImageCmpProps } from 'types';
import '../i18n';
import './styles.scss';

const MyComponent = dynamic(() => import('./md-print'), { ssr: false });

const cloneURLSearchParams = (urlSearchParams: URLSearchParams) => {
  return new URLSearchParams(urlSearchParams.toString());
};

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
  
  const { query, push } = useRouter();
  
  const searchParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams('');
    for (const [ key, values ] of Object.entries(query)) {
      if (typeof values === 'string') {
        urlSearchParams.append(key, values);
      } else {
        for (const value of values) {
          urlSearchParams.append(key, value);
        }
      }
    }
    return urlSearchParams;
  }, [ query ]);
  
  const setSearchParams = useCallback(async (newSearchParams: URLSearchParams) => {
    const newSearchParamsSorted = cloneURLSearchParams(newSearchParams);
    const searchParamsSorted = cloneURLSearchParams(searchParams);
    newSearchParams.sort();
    searchParamsSorted.sort();
    if (newSearchParamsSorted.toString() !== searchParamsSorted.toString()) {
      await push({ query: newSearchParams.toString() });
    }
  }, [ searchParams ]);
  
  const appendSearchParam = useCallback(async ({ name, value }: { name: string, value: string }) => {
    const newSearchParams = cloneURLSearchParams(searchParams);
    newSearchParams.append(name, value);
    await setSearchParams(newSearchParams);
  }, [ searchParams, setSearchParams ]);
  
  const deleteSearchParam = useCallback(async ({ name, value }: { name: string, value?: string }) => {
    const newSearchParams = cloneURLSearchParams(searchParams);
    const values = newSearchParams.getAll(name);
    newSearchParams.delete(name);
    if (value !== undefined) {
      for (const v of values) {
        if (v !== value) {
          newSearchParams.append(name, v);
        }
      }
    }
    await setSearchParams(newSearchParams);
  }, [ searchParams, setSearchParams ]);
  
  const setSearchParam = useCallback(async ({ name, value }: { name: string, value: string | string[] }) => {
    const newSearchParams = cloneURLSearchParams(searchParams);
    newSearchParams.delete(name);
    let values = [];
    if (typeof value === 'string') {
      values.push(value);
    } else {
      values = value;
    }
    for (const value of values) {
      newSearchParams.append(name, value);
    }
    await setSearchParams(newSearchParams);
  }, [ searchParams, setSearchParams ]);
  
  if (router.route === '/md-print') {
    return <div><MyComponent {...pageProps} /></div>;
  }
  
  const app = (
    <JukiUIProvider
      components={{ Image: Image as FC<ImageCmpProps>, Link: Link }}
      router={{ searchParams, setSearchParam, deleteSearchParam, appendSearchParam }}
    >
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
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary>{app}</ErrorBoundary>;
}
