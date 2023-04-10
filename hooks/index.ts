import { LastLinkContext } from 'components';
import { useFetcher as useFetcherJk, useJukiUser } from 'hooks';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SWRConfiguration } from 'swr';
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
    const searchParamsObject: { [key: string]: string[] } = {};
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
  const { user: { nickname } } = useJukiUser();
  const { data, error, isLoading, mutate, isValidating } = useFetcherJk<T>(firstRefresh ? url : null, options);
  
  const request = useCallback(async () => {
    if (!firstRefresh) {
      setFirstRefresh(true);
    } else {
      await mutate();
    }
  }, [mutate, firstRefresh]);
  
  useEffect(() => {
    void mutate();
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
    setLoaderStatusRef: useCallback((setLoaderStatus) => setLoaderStatusRef.current = setLoaderStatus, []),
    // setLoaderStatusRef: useCallback((setLoaderStatus: SetLoaderStatusType) => setLoaderStatusRef.current = setLoaderStatus, []),
  };
};

// TODO: check when getUrl changes
export const useDataViewerRequester2 = <T extends ContentResponseType<any> | ContentsResponseType<any>, >(getUrl: GetUrl, options?: SWRConfiguration) => {
  
  const setLoaderStatusRef = useRef<SetLoaderStatusType>();
  const { user: { nickname } } = useJukiUser();
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
    void mutate();
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
    setLoaderStatusRef: useCallback((setLoaderStatus: SetLoaderStatusType) => setLoaderStatusRef.current = setLoaderStatus, []),
  };
};

export const useLasLink = () => {
  const { lastLink, pushPath } = useContext(LastLinkContext);
  return { lastLink, pushPath };
};

export const useTrackLastPath = (key: string) => {
  const { pushPath } = useContext(LastLinkContext);
  const { query, pathname } = useRouter();
  useEffect(() => {
    pushPath({ key, pathname, query });
  }, [key, query, pathname]);
};

export {
  useOutsideAlerter,
  useNotification,
  useT,
  useJukiUser,
  useJukiUI,
  useFetcher,
  useSWR,
  useJukiUserToggleSetting,
  useJkSocket,
  useMatchMutate,
  usePrevious,
} from '@juki-team/base-ui';
export { useResizeDetector } from 'react-resize-detector';
export * from './contest';
export * from './rejudge';
export * from './task';
export * from './useDateFormat';
