'use client';

import { UserViewLayout } from 'components';
import { jukiApiManager } from 'config';
import { contentResponse } from 'helpers';
import { useFetcher } from 'hooks';
import { ContentResponseType, UserProfileResponseDto } from 'types';

export function ProfileViewPage({ profile: fallbackData }: { profile: UserProfileResponseDto }) {
  
  const {
    data: dataContest,
    mutate,
  } = useFetcher<ContentResponseType<UserProfileResponseDto>>(
    jukiApiManager.API_V2.user.getProfile({
      params: {
        nickname: fallbackData.nickname,
        organizationKey: fallbackData.organization?.key,
      },
    }).url,
    { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) });
  const user = dataContest?.success ? dataContest.content : fallbackData;
  
  return <UserViewLayout user={user} reloadUser={mutate} />;
  
}
