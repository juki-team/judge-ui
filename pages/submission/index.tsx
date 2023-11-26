import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  
  const { replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(ROUTES.HOME.PAGE());
  }, [ replaceRoute ]);
  
  return null;
}

export default View;
