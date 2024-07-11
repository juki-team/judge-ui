import { jukiSettings } from 'config';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  
  const { replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(jukiSettings.ROUTES.problems().list());
  }, [ replaceRoute ]);
  
  return null;
}

export default View;
