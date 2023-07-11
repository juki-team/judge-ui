import { ROUTES } from 'config/constants';
import { useEffect, useRouter } from 'hooks';
import { ContestTab } from 'types';

function View() {
  const { query, replace, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.CONTESTS.VIEW(query.key as string, ContestTab.OVERVIEW));
    }
  }, [ replace, query, isReady ]);
  return null;
}

export default View;
