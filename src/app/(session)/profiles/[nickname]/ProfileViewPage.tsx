'use client';

import { ProfileSubmissions, T, UserViewLayout } from 'components';
import { useUserStore } from 'hooks';
import { KeyedMutator, ProfileTab, UserProfileResponseDTO } from 'types';

interface ProfileViewLayoutProps {
  profile: UserProfileResponseDTO,
  reloadProfile: KeyedMutator<any>,
}

export function ProfileViewPage({ profile, reloadProfile }: ProfileViewLayoutProps) {
  
  const userNickname = useUserStore(state => state.user.nickname);
  
  const tabHeaders = {
    [ProfileTab.SUBMISSIONS]: {
      key: ProfileTab.SUBMISSIONS,
      header: userNickname === profile.nickname
        ? <T className="tt-ce ws-np">my submissions</T>
        : <T className="tt-ce ws-np">submissions</T>,
      body: <ProfileSubmissions />,
    },
  };
  
  return (
    <UserViewLayout
      user={profile}
      reloadUser={reloadProfile}
      extraTabs={tabHeaders}
    />
  );
}
