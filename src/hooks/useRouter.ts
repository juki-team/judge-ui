import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export const useRouter = () => {
  const { push: pushRouter, replace: replaceRouter, ...rest } = useNextRouter();
  const [ isPending, startTransition ] = useTransition();
  
  const push = useCallback(async (url: string) => {
    // setLoaderCounter(prevState => prevState + 1);
    // startTransition(() => {
    //   pushRouter(url);
    // });
    pushRouter(url);
    // setLoaderCounter(prevState => prevState - 1);
  }, [ pushRouter ]);
  
  const replace = useCallback(async (url: string) => {
    // startTransition(() => {
    //   replaceRouter(url);
    // });
    replaceRouter(url);
  }, [ replaceRouter ]);
  
  return { ...rest, push, replace, isLoadingRoute: !!isPending };
};
