import { settings } from '@juki-team/base-ui';
import { useFetcher as useFetcherJk } from 'hooks';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUserState } from 'store';
import { SWRConfiguration, useSWRConfig } from 'swr';
import {
  ContentResponseType,
  ContentsResponseType,
  GetUrl,
  RequestFilterType,
  RequestSortType,
  SetLoaderStatusType,
  Status,
} from 'types';

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

export const useDataViewerRequester = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(url: string, options?: SWRConfiguration) => {
  
  const setLoaderStatusRef = useRef<SetLoaderStatusType>();
  const [firstRefresh, setFirstRefresh] = useState(false);
  const { nickname } = useUserState();
  const { data, error, isLoading, mutate, isValidating } = useFetcherJk<T>(firstRefresh ? url : null, options);
  
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

// TODO: check when getUrl changes
export const useDataViewerRequester2 = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(getUrl: GetUrl, options?: SWRConfiguration) => {
  
  const setLoaderStatusRef = useRef<SetLoaderStatusType>();
  const { nickname } = useUserState();
  const [url, setUrl] = useState(null);
  const { data, error, isLoading, mutate, isValidating } = useFetcherJk<T>(url, options);
  
  const request = useCallback(async ({
    pagination,
    filter,
    sort,
  }: { pagination?: { page: number, pageSize: number }, filter: RequestFilterType, sort: RequestSortType }) => {
    const newUrl = getUrl({ pagination: pagination || { page: 0, pageSize: 16 }, filter, sort });
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

export function useMatchMutate() {
  const { cache, mutate } = useSWRConfig();
  return (matcher, ...args) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance');
    }
    
    const keys = [];
    
    // @ts-ignore
    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        keys.push(key);
      }
    }
    const mutations = keys.map((key) => mutate(key, ...args));
    return Promise.all(mutations);
  };
}

export const useSWR = () => {
  const { mutate } = useSWRConfig();
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(settings.TOKEN_NAME) || '';
  }
  return {
    mutate: useCallback((url: string) => mutate([url, token]), []),
  };
};

export {
  useOutsideAlerter,
  useNotification,
  useT,
  useJukiBase,
  useFetcher,
} from '@juki-team/base-ui';
export * from './contest';
export * from './useDateFormat';
export * from './useOnline';
