import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ContestsTab } from 'types';

function Contests() {
  
  const { replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(ROUTES.CONTESTS.LIST(ContestsTab.ALL));
  }, [ replaceRoute ]);
  
  return null;
}

export default Contests;
