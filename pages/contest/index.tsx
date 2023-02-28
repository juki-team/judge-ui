import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';
import { ContestsTab } from 'types';

function View() {
  const { query, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      void push(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
    }
  }, [push, query, isReady]);
  return null;
}

export default View;
