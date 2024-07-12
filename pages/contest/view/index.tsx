import { jukiSettings } from 'config';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  const { routeParams, replaceRoute } = useJukiRouter();
  useEffect(() => {
    void replaceRoute(jukiSettings.ROUTES.contests().list());
  }, [ replaceRoute, routeParams ]);
  return null;
}

export default View;
