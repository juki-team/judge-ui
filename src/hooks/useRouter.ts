import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useRouter = () => {
  
  const { push: pushRouter, replace: replaceRouter, ...rest } = useNextRouter();
  
  const push = useCallback(async (url: string) => {
    pushRouter(url);
  }, [ pushRouter ]);
  
  const replace = useCallback(async (url: string) => {
    replaceRouter(url);
  }, [ replaceRouter ]);
  
  return { ...rest, push, replace, isLoadingRoute: false };
};
