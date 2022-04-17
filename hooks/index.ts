import { cleanRequest } from 'helpers';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ContentResponseType, ContentsResponseType, HTTPMethod, Status } from 'types';

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

export const useFetcher = <T extends (ContentResponseType<any> | ContentsResponseType<any>)>(url?: string, options?: UseFetcherOptionsType) => {
  
  const {
    revalidateIfStale = true,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval,
  } = options || {};
  
  const { data, error } = useSWR(url, fetcher, { revalidateIfStale, revalidateOnFocus, revalidateOnReconnect, refreshInterval });
  
  return useMemo(() => ({
    data: data ? cleanRequest<T>(data) : undefined,
    error,
    isLoading: error === undefined && data === undefined,
  }), [data, error]);
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

export const useRequester = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(url: string, options?: UseFetcherOptionsType) => {
  
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useFetcher<T>(url, options);
  
  const refresh = useCallback(async (props?) => {
    const { setLoaderStatus } = props || {};
    setLoaderStatus?.(Status.LOADING);
    await mutate(url);
    setLoaderStatus?.(Status.SUCCESS);
  }, [data, url]);
  
  return {
    data,
    error,
    isLoading,
    refresh,
  };
};

export {
  useOutsideAlerter,
  useNotification,
  useT,
} from '@juki-team/base-ui';
export * from './useOnline';
