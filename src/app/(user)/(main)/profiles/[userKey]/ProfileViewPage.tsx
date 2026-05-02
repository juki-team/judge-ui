'use client';

import { UserViewLayout, useFetcher } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { type UserProfileResponseDTO } from '@juki-team/commons/dto';
import { contentResponse } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';

export function ProfileViewPage({ profile: fallbackData }: { profile: UserProfileResponseDTO }) {

  const {
    data: dataContest,
    mutate,
  } = useFetcher<ContentResponse<UserProfileResponseDTO>>(
    jukiApiManager.apiV2.user.getProfile({
      params: {
        nickname: fallbackData.nickname,
        companyKey: fallbackData.company?.key,
      },
    }).url,
    { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) });
  const user = dataContest?.success ? dataContest.content : fallbackData;

  return <UserViewLayout user={user} reloadUser={mutate} />;

}
