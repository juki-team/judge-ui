import { useContext, useEffect } from 'react';
import { LastLinkContext } from '../components';
import { useJukiRouter } from './commons';

export const useLastLink = () => {
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

