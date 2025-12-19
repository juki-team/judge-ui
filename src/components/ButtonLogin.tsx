'use client';

import { jukiAppRoutes } from 'config';
import { useRouterStore, useUserStore } from 'hooks';
import { LoginUser } from './index';

export const ButtonLogin = () => {
  const pushRoute = useRouterStore(store => store.pushRoute);
  const isLogged = useUserStore(store => store.user.isLogged);
  
  if (isLogged) {
    return null;
  }
  
  return (
    <LoginUser
      collapsed={false}
      isHorizontal={true}
      onSeeMyProfile={(nickname, companyKey) => pushRoute(jukiAppRoutes.JUDGE().profiles.view({
        nickname,
        companyKey,
      }))}
    />
  );
};
