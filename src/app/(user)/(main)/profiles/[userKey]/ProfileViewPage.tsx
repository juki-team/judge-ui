'use client';

import { UserViewLayout } from 'components';
import { jukiApiManager } from 'config';
import { contentResponse } from 'helpers';
import { useFetcher } from 'hooks';
import { ContentResponseType, UserProfileResponseDTO } from 'types';

export function ProfileViewPage({ profile: fallbackData }: { profile: UserProfileResponseDTO }) {
  
  const {
    data: dataContest,
    mutate,
  } = useFetcher<ContentResponseType<UserProfileResponseDTO>>(
    jukiApiManager.API_V2.user.getProfile({
      params: {
        nickname: fallbackData.nickname,
        companyKey: fallbackData.company?.key,
      },
    }).url,
    { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) });
  const user = dataContest?.success ? dataContest.content : fallbackData;
  
  return <UserViewLayout user={user} reloadUser={mutate} />;
  
}
