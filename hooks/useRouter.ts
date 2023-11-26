import { useRouter as useNextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useRouter = () => {
  
  const router = useNextRouter();
  
  const {
    pathname,
    asPath,
    locale,
    query,
    push: pushRouter,
    replace: replaceRouter,
    route,
    reload,
    isReady,
  } = router;
  
  const [ isLoadingRoute, setIsLoadingRoute ] = useState(false);
  
  useEffect(() => {
    
    const handleRouteChangeStart = () => setIsLoadingRoute(true);
    const handleRouteChangeComplete = () => setIsLoadingRoute(false);
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);
    
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [ router ]);
  
  const push = useCallback(async (url: string) => {
    await pushRouter(url);
  }, [ pushRouter ]);
  
  const replace = useCallback(async (url: string) => {
    await replaceRouter(url);
  }, [ replaceRouter ]);
  
  const routerParams = useMemo(() => {
    const routeParamsKeys = route.split('/').filter(route => route === `[${route.substring(1, route.length - 1)}]`).map(route => route.substring(1, route.length - 1));
    const routeParams: ParsedUrlQuery = {};
    for (const [ key, values ] of Object.entries(query)) {
      if (routeParamsKeys.includes(key) && values) {
        routeParams[key] = values;
      }
    }
    return routeParams;
  }, [ route, query ]);
  
  return { pathname, asPath, routerParams, push, replace, reload, isReady, locale, isLoadingRoute };
};
