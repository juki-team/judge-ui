import { cleanRequest } from 'helpers';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { ContentResponseType, ContentsResponseType, HTTPMethod, Status } from 'types';
import { useUserState } from '../store';
import { SetLoaderStatusType } from '../types';

const fetcher = (url: string, method?: HTTPMethod, body?: string, signal?: AbortSignal) => {
  
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
  const { nickname, isLoading: userIsLoading } = useUserState();
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




export {
  useOutsideAlerter,
  useNotification,
  useT,
} from '@juki-team/base-ui';
export * from './contest';
export * from './useOnline';
