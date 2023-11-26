import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ProblemTab } from 'types';

function View() {
  
  const { routeParams: { key }, replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(ROUTES.PROBLEMS.VIEW(key as string, ProblemTab.STATEMENT));
  }, [ key, replaceRoute ]);
  
  return null;
}

export default View;
