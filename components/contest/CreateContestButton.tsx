import { ButtonLoader, PlusIcon, T } from 'components';
import { jukiSettings } from 'config';
import { buttonLoaderLink } from 'helpers';
import { useJukiRouter } from 'hooks';

export const CreateContestButton = () => {
  
  const { pushRoute } = useJukiRouter();
  
  return (
    <ButtonLoader
      size="small"
      icon={<PlusIcon />}
      onClick={buttonLoaderLink(() => pushRoute(jukiSettings.ROUTES.contests().new()))}
      responsiveMobile
    >
      <T>create</T>
    </ButtonLoader>
  );
};
