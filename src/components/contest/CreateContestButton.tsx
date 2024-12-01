'use client';

import { ButtonLoader, PlusIcon, T } from 'components';
import { jukiAppRoutes } from 'config';
import { buttonLoaderLink } from 'helpers';
import { useJukiRouter } from 'hooks';

export const CreateContestButton = () => {
  
  const { pushRoute } = useJukiRouter();
  
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
