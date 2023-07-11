import { ROUTES } from 'config/constants';
import { useEffect, useRouter } from 'hooks';
import { ContestsTab } from 'types';

function View() {
  const { query, isReady, replace } = useRouter();
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
    }
  }, [ replace, query, isReady ]);
  return null;
}

export default View;
