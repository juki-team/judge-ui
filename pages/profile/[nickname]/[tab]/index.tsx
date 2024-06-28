import { FetcherLayer, ProfileViewLayout } from 'components';
import { jukiSettings } from 'config';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, UserProfileResponseDTO } from 'types';
import Custom404 from '../../../404';

export default function ProfileView() {
  
  const { routeParams: { nickname } } = useJukiRouter();
  
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname ? jukiSettings.API.user.getProfile({ params: { nickname: nickname as string } }).url : null}
      errorView={<Custom404 />}
    >
      {({ data, mutate }) => <ProfileViewLayout profile={data.content} reloadProfile={mutate} />}
    </FetcherLayer>
  );
}
