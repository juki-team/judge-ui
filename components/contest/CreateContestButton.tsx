import { ButtonLoader, PlusIcon, T } from 'components';
import { ROUTES } from 'config/constants';
import { buttonLoaderLink } from 'helpers';
import { useJukiRouter } from 'hooks';

export const CreateContestButton = () => {
  
  const { pushRoute } = useJukiRouter();
  
  return (
    <ButtonLoader
      size="small"
      icon={<PlusIcon />}
      onClick={buttonLoaderLink(() => pushRoute(ROUTES.CONTESTS.CREATE()))}
      responsiveMobile
    >
      <T>create</T>
    </ButtonLoader>
  );
};
