'use client';

import { ButtonLoader, PlusIcon, T } from 'components';
import { jukiAppRoutes } from 'config';
import { buttonLoaderLink } from 'helpers';
import { useRouterStore } from 'hooks';

export const CreateContestButton = () => {
  
  const pushRoute = useRouterStore(state => state.pushRoute);
  
  return (
    <ButtonLoader
      size="small"
      icon={<PlusIcon />}
      onClick={buttonLoaderLink(() => pushRoute(jukiAppRoutes.JUDGE().contests.new()))}
      responsiveMobile
    >
      <T>create</T>
    </ButtonLoader>
  );
};
