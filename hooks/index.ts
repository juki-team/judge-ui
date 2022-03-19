import { DELETE, GET, POST, PUT } from 'config/constants';
import { clean } from 'helpers';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ContentResponseType, ContentsResponseType, Status } from 'types';

export {
  useOutsideAlerter, useNotification,
} from '@bit/juki-team.juki.base-ui';
export * from './useOnline';

const fetcher = (url: string, method?: typeof POST | typeof PUT | typeof DELETE | typeof GET, body?: string, signal?: AbortSignal) => {
  
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Content-Type', 'application/json');
  
  return fetch(url, {
    method: method ? method : GET,
    headers: requestHeaders,
    credentials: 'include',
    ...(body ? { body } : {}),
    ...(signal ? { signal } : {}),
  }).then((res) => res.text());
};

export const useFetcher = <T extends (ContentResponseType<any> | ContentsResponseType<any>)>(url?: string, options?: {
  revalidateIfStale?: boolean,
  revalidateOnFocus?: boolean,
  revalidateOnReconnect?: boolean,
}) => {
  
  const {
    revalidateIfStale = true,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
  } = options || {};
  
  const { data, error } = useSWR(url, fetcher, { revalidateIfStale, revalidateOnFocus, revalidateOnReconnect });
  
  return useMemo(() => ({
    data: data ? clean<T>(data) : undefined,
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

export const useRequester = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(url: string) => {
  
  const { mutate } = useSWRConfig();
  console.log('useRequester', url);
  const { data, error, isLoading } = useFetcher<T>(url);
  
  const refresh = useCallback(async (props?) => {
    const { setLoaderStatus } = props || {};
    console.log({ props, url });
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
