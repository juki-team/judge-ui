import { PageNotFound, TwoContentLayout } from 'components';
import { jukiApiManager } from 'config';
import { get, oneTab } from 'helpers';
import { ContentResponseType, UserProfileResponseDTO } from 'types';
import { ProfileViewPage } from './ProfileViewPage';

type Props = {
  params: Promise<{ nickname: string }>
}

export default async function Page({ params }: Props) {
  
  const { nickname } = await params;
  
  const profileResponse = await get<ContentResponseType<UserProfileResponseDTO>>(jukiApiManager.API_V2.user.getProfile({ params: { nickname } }).url);
  
  if (profileResponse.success) {
    return (
      <ProfileViewPage profile={profileResponse.content} />
    );
  }
  
  return <TwoContentLayout tabs={oneTab(<PageNotFound />)} />;
}
