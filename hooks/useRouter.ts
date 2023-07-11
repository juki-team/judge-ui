import { useRouter as useNextRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
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
      } else if (Array.isArray(value)) {
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
