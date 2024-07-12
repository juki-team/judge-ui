import { jukiSettings } from 'config';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  
  const { replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(jukiSettings.ROUTES.root());
  }, [ replaceRoute ]);
  
  return null;
}

export default View;
