import { jukiSettings } from 'config';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  const { replaceRoute } = useJukiRouter();
  useEffect(() => {
    void replaceRoute(jukiSettings.ROUTES.contests().list());
  }, [ replaceRoute ]);
  return null;
}

export default View;
