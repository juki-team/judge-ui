import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ContestTab } from 'types';

function View() {
  const { routeParams, replaceRoute } = useJukiRouter();
  useEffect(() => {
    void replaceRoute(ROUTES.CONTESTS.VIEW(routeParams.key as string, ContestTab.OVERVIEW));
  }, [ replaceRoute, routeParams ]);
  return null;
}

export default View;
