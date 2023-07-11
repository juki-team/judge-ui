import { ROUTES } from 'config/constants';
import { useEffect, useRouter } from 'hooks';
import { ContestsTab } from 'types';

function Contests() {
  const { query, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      void push(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
    }
  }, [ push, query, isReady ]);
  return null;
}

export default Contests;
