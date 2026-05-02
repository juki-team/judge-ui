import { PageNotFound, TwoContentLayout } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { get } from 'helpers';
import { oneTab } from '@juki-team/base-ui/helpers';
import { type UserProfileResponseDTO } from '@juki-team/commons/dto';
import { getParamsOfUserKey } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { ProfileViewPage } from './ProfileViewPage';

type Props = {
  params: Promise<{ userKey: string }>
}

export default async function Page({ params }: Props) {

  const { userKey } = await params;
  const { userNickname, userCompanyKey } = getParamsOfUserKey(decodeURIComponent(userKey));

  const profileResponse = await get<ContentResponse<UserProfileResponseDTO>>(jukiApiManager.apiV2.user.getProfile({
    params: {
      nickname: userNickname,
      companyKey: userCompanyKey,
    },
  }).url);

  if (profileResponse.success) {
    return (
      <ProfileViewPage profile={profileResponse.content} />
    );
  }

  return <TwoContentLayout tabs={oneTab(<PageNotFound />)} />;
}
