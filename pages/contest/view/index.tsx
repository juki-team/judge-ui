import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ContestsTab } from 'types';

function View() {
  const { routeParams, replaceRoute } = useJukiRouter();
  useEffect(() => {
    void replaceRoute(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
  }, [ replaceRoute, routeParams ]);
  return null;
}

export default View;
