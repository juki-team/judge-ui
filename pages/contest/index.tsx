import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ContestsTab } from 'types';

function View() {
  const { routerReplace } = useJukiRouter();
  useEffect(() => {
    void routerReplace(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
  }, [ routerReplace ]);
  return null;
}

export default View;
