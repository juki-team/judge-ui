'use client';

import { LoginUser, useRouterStore, useUserStore } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';

export const ButtonLogin = () => {
  const pushRoute = useRouterStore(store => store.pushRoute);
  const isLogged = useUserStore(store => store.user.isLogged);
  
  if (isLogged) {
    return null;
  }
  
  return (
    <LoginUser
      isHorizontal={true}
      onSeeMyProfile={(nickname, organizationKey) => (
        pushRoute(jukiAppRoutes.JUDGE().profiles.view({ nickname, organizationKey }))
      )}
    />
  );
};
