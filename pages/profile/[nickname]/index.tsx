import { ROUTES } from 'config/constants';
import { useEffect, useJukiRouter } from 'hooks';
import { ProfileTab } from 'types';

function Profile() {
  
  const { routeParams: { nickname }, replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(ROUTES.PROFILE.PAGE(nickname as string, ProfileTab.PROFILE));
  }, [ replaceRoute, nickname ]);
  
  return null;
}

export default Profile;
