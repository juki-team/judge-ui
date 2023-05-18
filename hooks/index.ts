import { useJukiUser } from '@juki-team/base-ui';
import { LastLinkContext } from 'components';
import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UrlObject } from 'url';

interface TransitionOptions {
  shallow?: boolean,
  locale?: string | false,
  scroll?: boolean,
  unstable_skipClientCache?: boolean,
}

export const useRouter = () => {
  const { query, push: pushRouter, ...rest } = useNextRouter();
  const [ loaderCounter, setLoaderCounter ] = useState(0);
  const queryObject = useMemo(() => {
    const searchParamsObject: { [key: string]: string[] } = {};
    Object.entries(query).forEach(([ key, value ]) => {
      if (typeof value === 'string') {
        searchParamsObject[key] = [ value ];
      } else {
        searchParamsObject[key] = value;
      }
    });
    return searchParamsObject;
  }, [ query ]);
  
  const push = useCallback(async (url: UrlObject | string, as?: UrlObject | string, options?: TransitionOptions) => {
    setLoaderCounter(prevState => prevState + 1);
    const result = await pushRouter(url, as, options);
    setLoaderCounter(prevState => prevState - 1);
    return result;
  }, [ pushRouter ]);
  
  return { query, queryObject, push, isLoading: !!loaderCounter, ...rest };
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
  }, [ key, query, pathname ]);
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
  useDataViewerRequester,
} from '@juki-team/base-ui';
export { useResizeDetector } from 'react-resize-detector';
export * from './contest';
export * from './rejudge';
export * from './task';
export * from './useDateFormat';
