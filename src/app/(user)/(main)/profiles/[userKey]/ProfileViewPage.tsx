'use client';

import { AccessTokens, T, UserViewLayout } from 'components';
import { jukiApiManager } from 'config';
import { contentResponse } from 'helpers';
import { useFetcher, useUserStore } from 'hooks';
import { ContentResponseType, ProfileTab, UserProfileResponseDto } from 'types';

// not in the ProfileTab enum of base-ui: it's a tab of judge-ui only
const ACCESS_TOKENS_TAB = 'access-tokens' as ProfileTab;

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
  const userNickname = useUserStore(state => state.user.nickname);
  const userOrganizationKey = useUserStore(state => state.user.organization.key);
  const isOwnProfile = user.nickname === userNickname && user.organization.key === userOrganizationKey;

  const extraTabs = isOwnProfile ? {
    [ACCESS_TOKENS_TAB]: {
      key: ACCESS_TOKENS_TAB,
      header: <T className="tt-ce ws-np">access tokens</T>,
      body: <AccessTokens />,
    },
  } : undefined;

  return <UserViewLayout user={user} reloadUser={mutate} extraTabs={extraTabs} />;

}
