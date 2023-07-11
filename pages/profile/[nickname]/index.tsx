import { ROUTES } from 'config/constants';
import { useEffect, useRouter } from 'hooks';
import { ProfileTab } from 'types';

function Profile() {
  const { query, isReady, replace } = useRouter();
  const { nickname } = query;
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.PROFILE.PAGE(nickname as string, ProfileTab.PROFILE));
    }
  }, [ replace, query, isReady ]);
  return null;
}

export default Profile;