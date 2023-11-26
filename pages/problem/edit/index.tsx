import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';

function View() {
  const { replaceRoute } = useJukiRouter();
  useEffect(() => {
    void replaceRoute(ROUTES.PROBLEMS.LIST());
  }, [ replaceRoute ]);
  return null;
}

export default View;