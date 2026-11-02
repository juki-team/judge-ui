import { PageNotFound, TwoContentLayout } from 'components';
import { jukiApiManager } from 'config';
import { get, getParamsOfUserKey, oneTab } from 'helpers';
import { ContentResponseType, UserProfileResponseDto } from 'types';
import { ProfileViewPage } from './ProfileViewPage';

type Props = {
  params: Promise<{ userKey: string }>
}

export default async function Page({ params }: Props) {
  
  const { userKey } = await params;
  const { userNickname, userOrganizationKey } = getParamsOfUserKey(decodeURIComponent(userKey));
  
  const profileResponse = await get<ContentResponseType<UserProfileResponseDto>>(jukiApiManager.API_V2.user.getProfile({
    params: {
      nickname: userNickname,
      organizationKey: userOrganizationKey,
    },
  }).url);
  
  if (profileResponse.success) {
    return (
      <ProfileViewPage profile={profileResponse.content} />
    );
  }
  
  return <TwoContentLayout tabs={oneTab(<PageNotFound />)} />;
}
