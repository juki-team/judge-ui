import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

export const useRouter = () => {
  const { push: pushRouter, replace: replaceRouter, ...rest } = useNextRouter();
  const [ loaderCounter, setLoaderCounter ] = useState(0);
  const [ isPending, startTransition ] = useTransition();
  
  const push = useCallback(async (url: string) => {
    // setLoaderCounter(prevState => prevState + 1);
    startTransition(() => {
      pushRouter(url);
    });
    // setLoaderCounter(prevState => prevState - 1);
  }, [ pushRouter ]);
  
  const replace = useCallback(async (url: string) => {
    startTransition(() => {
      replaceRouter(url);
    });
  }, [ replaceRouter ]);
  
  return { push, replace, isLoadingRoute: !!isPending, ...rest };
};
