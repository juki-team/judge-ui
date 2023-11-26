import { LastLinkContext } from 'components';
import { useContext, useEffect } from 'react';
import { useJukiRouter } from './commons';

export const useLasLink = () => {
  const { lastLink, pushPath } = useContext(LastLinkContext);
  return { lastLink, pushPath };
};

export const useTrackLastPath = (key: string) => {
  const { pushPath } = useContext(LastLinkContext);
  const { pathname, searchParams } = useJukiRouter();
  useEffect(() => {
    pushPath({ key, pathname, searchParams });
  }, [ key, searchParams, pathname ]);
};

export * from './commons';
export * from './contest';
export * from './rejudge';
export * from './task';
export * from './useDateFormat';
