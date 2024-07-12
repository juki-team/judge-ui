import { jukiSettings } from 'config';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  const { routeParams: { key }, replaceRoute } = useJukiRouter();
  useEffect(() => {
    void replaceRoute(jukiSettings.ROUTES.contests().view({ key: key as string }));
  }, [ replaceRoute, key ]);
  return null;
}

export default View;
