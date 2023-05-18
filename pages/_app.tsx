import { Analytics } from '@vercel/analytics/react';
import { ErrorBoundary, JukiUIProvider, JukiUserProvider, LineLoader, NavigationBar, T } from 'components';
import { settings } from 'config';
import { JUKI_SERVICE_BASE_URL, JUKI_TOKEN_NAME, NODE_ENV } from 'config/constants';
import { consoleWarn } from 'helpers';
import { useJukiUser, useRouter } from 'hooks';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { _setFlags, TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import { AppendSearchParamsType, ImageCmpProps } from 'types';
import '../i18n';
import './styles.scss';

const MyComponent = dynamic(() => import('./md-print'), { ssr: false });

const cloneURLSearchParams = (urlSearchParams: URLSearchParams) => {
  return new URLSearchParams(urlSearchParams.toString());
};

const CustomHead = () => {
  const { company } = useJukiUser();
  return (
    <Head>
      <title>{company.name + ' judge'}</title>
    </Head>
  );
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
  
  const { query, push, isReady, isLoading, ...props } = useRouter();
  
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
  
  const [ updateTrigger, setUpdateTrigger ] = useState(Date.now());
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const time = useRef(Date.now());
  const updateSearchParams = useCallback(async (newSearchParams: URLSearchParams) => {
    const newSearchParamsSorted = cloneURLSearchParams(newSearchParams);
    const searchParamsSorted = cloneURLSearchParams(searchParamsRef.current);
    newSearchParamsSorted.sort();
    searchParamsSorted.sort();
    time.current = Date.now();
    if (newSearchParamsSorted.toString() !== searchParamsSorted.toString()) {
      await push({ query: newSearchParams.toString() });
    }
  }, []);
  
  const appendSearchParamsActionsRef = useRef([]);
  
  useEffect(() => {
    const chunkUpdateSearchParams = async () => {
      const newSearchParams = cloneURLSearchParams(searchParamsRef.current);
      for (const searchParamsActions of appendSearchParamsActionsRef.current) {
        if (searchParamsActions.action === 'appendSearchParams') {
          for (const { name, value } of searchParamsActions.props) {
            newSearchParams.append(name, value);
          }
        } else if (searchParamsActions.action === 'appendSearchParams') {
          for (const { name, value } of searchParamsActions.props) {
            const values = newSearchParams.getAll(name);
            newSearchParams.delete(name);
            if (value !== undefined) {
              for (const v of values) {
                if (v !== value) {
                  newSearchParams.append(name, v);
                }
              }
            }
          }
        } else if (searchParamsActions.action === 'setSearchParams') {
          for (const { name, value } of searchParamsActions.props) {
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
          }
        }
      }
      if (appendSearchParamsActionsRef.current.length) {
        appendSearchParamsActionsRef.current = [];
        await updateSearchParams(newSearchParams);
      }
    };
    void chunkUpdateSearchParams();
  }, [ searchParams, updateTrigger ]);
  
  const appendSearchParams: AppendSearchParamsType = useCallback(async (...props) => {
    appendSearchParamsActionsRef.current.push({ action: 'appendSearchParams', props });
    setUpdateTrigger(Date.now());
  }, []);
  
  const deleteSearchParams = useCallback(async (...props) => {
    appendSearchParamsActionsRef.current.push({ action: 'deleteSearchParams', props });
    setUpdateTrigger(Date.now());
  }, []);
  
  const setSearchParams = useCallback(async (...props) => {
    appendSearchParamsActionsRef.current.push({ action: 'setSearchParams', props });
    setUpdateTrigger(Date.now());
  }, []);
  
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
          <div className="sponsored-by">
            <T>sponsored by</T>&nbsp;
            <a href="https://juki.app" target="_blank" rel="noreferrer">Juki.app</a>
          </div>
        </div>
      </JukiUserProvider>
    </JukiUIProvider>
  );
  
  return NODE_ENV === 'development' ? app : <ErrorBoundary>{app}</ErrorBoundary>;
}
