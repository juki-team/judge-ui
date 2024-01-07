import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { AdminTab } from 'types';

function Admin() {
  
  const { routeParams, replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(ROUTES.ADMIN.PAGE(AdminTab.SETTINGS_MANAGEMENT));
  }, [ replaceRoute, routeParams ]);
  
  return null;
}

export default Admin;
