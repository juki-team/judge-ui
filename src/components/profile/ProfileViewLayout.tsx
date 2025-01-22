'use client';

import {
  Button,
  ChangePasswordModal,
  EditProfileModal,
  LockIcon,
  ResetPasswordModal,
  T,
  TwoContentLayout,
  UserProfile,
  UserProfileSettings,
} from 'components';
import { jukiAppRoutes } from 'config';
import { useJukiRouter, useJukiUI, useJukiUser, useState } from 'hooks';
import { KeyedMutator } from 'swr';
import { ProfileTab, TabsType, UserProfileResponseDTO } from 'types';
import { MyActiveSessions } from './MyActiveSessions';
import { ProfileSubmissions } from './ProfileSubmissions';

interface ProfileViewLayoutProps {
  profile: UserProfileResponseDTO,
  reloadProfile: KeyedMutator<any>,
}

export function ProfileViewLayout({ profile, reloadProfile }: ProfileViewLayoutProps) {
  
  const { mutatePing } = useJukiUser();
  const { routeParams, replaceRoute, searchParams } = useJukiRouter();
  const { user: { nickname: userNickname }, company } = useJukiUser();
  const [ openModal, setOpenModal ] = useState('');
  const { viewPortSize, components: { Link } } = useJukiUI();
  
  const { nickname } = routeParams as { nickname: string };
  const onClose = () => setOpenModal('');
  const tab = searchParams.get('tab') as ProfileTab || ProfileTab.OVERVIEW;
  
  const tabHeaders: TabsType<ProfileTab> = {
    [ProfileTab.OVERVIEW]: {
      key: ProfileTab.OVERVIEW,
      header: <T className="tt-ce ws-np">overview</T>,
      body: <UserProfile user={profile} />,
    },
  };
  
  if (profile.nickname === userNickname) {
    tabHeaders[ProfileTab.SETTINGS] = {
      key: ProfileTab.SETTINGS,
      header: <T className="tt-ce ws-np">settings</T>,
      body: (
        <UserProfileSettings
          user={profile}
          onClickUpdatePassword={() => setOpenModal('UPDATE_PASSWORD')}
        />
      ),
    };
    tabHeaders[ProfileTab.MY_SESSIONS] = {
      key: ProfileTab.MY_SESSIONS,
      header: <T className="tt-ce ws-np">active sessions</T>,
      body: <MyActiveSessions />,
    };
  }
  
  tabHeaders[ProfileTab.SUBMISSIONS] = {
    key: ProfileTab.SUBMISSIONS,
    header: userNickname === nickname
      ? <T className="tt-ce ws-np">my submissions</T>
      : <T className="tt-ce ws-np">submissions</T>,
    body: <ProfileSubmissions />,
  };
  
  const extraNodes = [
    ...(profile.canResetPassword ? [
      <Button
        size={(viewPortSize !== 'sm') ? 'tiny' : 'regular'}
        icon={<LockIcon />}
        onClick={() => setOpenModal('RESET_PASSWORD')}
        expand={viewPortSize === 'sm'}
        key="reset password"
      >
        <T className="ws-np">reset password</T>
      </Button>,
    ] : []),
    ...(profile.canEditProfileData ? [
      <Button
        size={(viewPortSize !== 'sm') ? 'tiny' : 'regular'}
        icon={<LockIcon />}
        onClick={() => setOpenModal('DATA')}
        expand={viewPortSize === 'sm'}
        key="update profile"
      >
        <T className="ws-np">update profile</T>
      </Button>,
    ] : []),
  ];
  
  // const breadcrumbs: TwoContentLayoutProps<ProfileTab>['breadcrumbs'] = ({ selectedTabKey }) => [
  //   <Link
  //     href={jukiAppRoutes.JUDGE().profiles.view({ nickname: nickname as string, tab: ProfileTab.OVERVIEW })}
  //     className="link"
  //     key="nickname"
  //   >
  //     {nickname}
  //   </Link>,
  //   renderReactNodeOrFunctionP1(tabHeaders[selectedTabKey]?.header, { selectedTabKey }),
  // ];
  
  return (
    <>
      <ChangePasswordModal isOpen={openModal === 'UPDATE_PASSWORD'} onClose={onClose} />
      <ResetPasswordModal
        isOpen={openModal === 'RESET_PASSWORD'}
        onClose={onClose}
        nickname={profile.nickname}
        companyKey={company.key}
      />
      <EditProfileModal
        isOpen={openModal === 'DATA'}
        onClose={onClose}
        user={profile}
        onSuccess={async ({ body: { nickname } }) => {
          if (nickname !== profile.nickname) {
            replaceRoute(jukiAppRoutes.JUDGE().profiles.view({
              nickname: nickname as string,
              tab: ProfileTab.OVERVIEW,
            }));
          } else {
            await reloadProfile();
            await mutatePing();
          }
        }}
      />
      <TwoContentLayout
        // breadcrumbs={breadcrumbs}
        tabs={tabHeaders}
        tabButtons={extraNodes}
        selectedTabKey={tab}
        getHrefOnTabChange={(tab) => jukiAppRoutes.JUDGE().profiles.view({ nickname, tab })}
      >
        <h1>{nickname}</h1>
      </TwoContentLayout>
    </>
  );
}
