import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ContestTab } from 'types';

function View() {
  const { routeParams, routerReplace } = useJukiRouter();
  useEffect(() => {
    void routerReplace(ROUTES.CONTESTS.VIEW(routeParams.key as string, ContestTab.OVERVIEW));
  }, [ routerReplace, routeParams ]);
  return null;
}

export default View;
