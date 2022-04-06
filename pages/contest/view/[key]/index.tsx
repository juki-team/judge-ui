import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';
import { ContestTab } from 'types';

function View() {
  const { query, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      push(ROUTES.CONTESTS.VIEW(query.key as string, ContestTab.OVERVIEW));
    }
  }, [push, query, isReady]);
  return null;
}

export default View;
