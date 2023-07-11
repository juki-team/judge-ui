import { LastLinkContext } from 'components';
import { useContext, useEffect } from 'react';
import { useRouter } from './useRouter';

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

export * from './commons';
export * from './contest';
export * from './rejudge';
export * from './task';
export * from './useDateFormat';
export * from './useRouter';
export * from './useSearchParams';
