import useSWR from 'swr';
import { DELETE, GET, POST, PUT } from '../helpers/services';

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
