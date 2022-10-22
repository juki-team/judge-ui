import { authorizedRequest } from '@juki-team/base-ui';
import { cleanRequest } from 'helpers';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { ContentResponseType, ContentsResponseType, GetUrl, HTTPMethod, Status } from 'types';
import { useUserState } from '../store';
import { RequestFilterType, SetLoaderStatusType } from '../types';

const fetcher1 = (url: string, method?: HTTPMethod, body?: string, signal?: AbortSignal) => {
  
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Content-Type', 'application/json');
  
  return fetch(url, {
    method: method ? method : HTTPMethod.GET,
    headers: requestHeaders,
    credentials: 'include',
    ...(body ? { body } : {}),
    ...(signal ? { signal } : {}),
  }).then((res) => res.text());
};

export type UseFetcherOptionsType = {
  revalidateIfStale?: boolean,
  revalidateOnFocus?: boolean,
  revalidateOnReconnect?: boolean,
  refreshInterval?: number,
}
const fetcher = (url: string, method?: HTTPMethod, body?: string, signal?: AbortSignal) => {
  return authorizedRequest(url, { method, body, signal });
};

export const useFetcher = <T extends (ContentResponseType<any> | ContentsResponseType<any>)>(url?: string, options?: UseFetcherOptionsType, debug?: boolean) => {
  
  const {
    revalidateIfStale = true,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval,
  } = options || {};
  
  const { data, error, mutate, isValidating } = useSWR(url, fetcher, {
    revalidateIfStale,
    revalidateOnFocus,
    revalidateOnReconnect,
    refreshInterval,
  });
  
  return useMemo(() => ({
    data: data ? cleanRequest<T>(data) : undefined,
    error,
    isLoading: error === undefined && data === undefined,
    mutate,
    isValidating,
  }), [data, error, mutate, isValidating]);
};

export const useRouter = () => {
  const { query, ...rest } = useNextRouter();
  
  const queryObject = useMemo(() => {
    const searchParamsObject = {};
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        searchParamsObject[key] = [value];
      } else {
        searchParamsObject[key] = value;
      }
    });
    return searchParamsObject;
  }, [query]);
  
  return { query, queryObject, ...rest };
};

export const useDataViewerRequester = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(url: string, options?: UseFetcherOptionsType) => {
  
  const setLoaderStatusRef = useRef<SetLoaderStatusType>();
  const [firstRefresh, setFirstRefresh] = useState(false);
  const { nickname } = useUserState();
  const { data, error, isLoading, mutate, isValidating } = useFetcher<T>(firstRefresh ? url : null, options, true);
  
  const request = useCallback(async () => {
    if (!firstRefresh) {
      setFirstRefresh(true);
    } else {
      await mutate();
    }
  }, [mutate, firstRefresh]);
  
  useEffect(() => {
    mutate();
  }, [nickname]);
  
  useEffect(() => {
    if (isLoading || isValidating) {
      setLoaderStatusRef.current?.(Status.LOADING);
    } else {
      setLoaderStatusRef.current?.(Status.NONE);
    }
  }, [isLoading, isValidating]);
  
  return {
    data,
    error,
    isLoading: isLoading || isValidating,
    request,
    setLoaderStatusRef: useCallback(setLoaderStatus => setLoaderStatusRef.current = setLoaderStatus, []),
  };
};

export const useDataViewerRequester2 = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(getUrl: GetUrl, options?: UseFetcherOptionsType) => {
  
  const setLoaderStatusRef = useRef<SetLoaderStatusType>();
  const { nickname } = useUserState();
  const [url, setUrl] = useState(null);
  const { data, error, isLoading, mutate, isValidating } = useFetcher<T>(url, options, true);
  
  const request = useCallback(async ({
    pagination,
    filter,
  }: { pagination?: { page: number, pageSize: number }, filter: RequestFilterType }) => {
    const newUrl = getUrl({ pagination: pagination || { page: 0, pageSize: 16 }, filter });
    if (url !== newUrl) {
      setUrl(newUrl);
    } else {
      await mutate();
    }
  }, [mutate, url]);
  
  useEffect(() => {
    mutate();
  }, [nickname]);
  
  useEffect(() => {
    if (isLoading || isValidating) {
      setLoaderStatusRef.current?.(Status.LOADING);
    } else {
      setLoaderStatusRef.current?.(Status.NONE);
    }
  }, [isLoading, isValidating]);
  
  return {
    data,
    error,
    isLoading: isLoading || isValidating,
    request,
    setLoaderStatusRef: useCallback(setLoaderStatus => setLoaderStatusRef.current = setLoaderStatus, []),
  };
};

export {
  useOutsideAlerter,
  useNotification,
  useT,
  useJukiBase,
} from '@juki-team/base-ui';
export * from './contest';
export * from './useOnline';
