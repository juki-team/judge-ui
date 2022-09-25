import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';
import { ContestsTab } from 'types';

function Contests() {
  const { query, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      push(ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS));
    }
  }, [push, query, isReady]);
  return null;
}

export default Contests;
