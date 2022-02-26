import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { DELETE, GET, POST, PUT } from '../helpers/services';
import { JUDGE_API_V1 } from '../services/judge';
import { Status } from '../types';

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
  }).then((res) => res.json());
};

export const useFetcher = (url: string, options?: {
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
  return {
    data,
    error,
    isLoading: !error && !data,
  };
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

export const useRequestLoader = (path: string) => {
  
  const { mutate } = useSWRConfig();
  
  return useCallback(async ({ setLoading }) => {
    setLoading([1, Status.LOADING]);
    await mutate(path);
    setLoading([1, Status.SUCCESS]);
  }, []);
};