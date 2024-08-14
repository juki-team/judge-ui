import { TwoContentLayoutProps } from '@juki-team/base-ui';
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
import { ROUTES } from 'config/constants';
import { renderReactNodeOrFunctionP1 } from 'helpers';
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
  const { routeParams: { nickname }, replaceRoute } = useJukiRouter();
  const { user: { nickname: userNickname }, company } = useJukiUser();
  const [ openModal, setOpenModal ] = useState('');
  const { viewPortSize, components: { Link } } = useJukiUI();
  const onClose = () => setOpenModal('');
  
  const tabHeaders: TabsType<ProfileTab> = {
    [ProfileTab.PROFILE]: {
      key: ProfileTab.PROFILE,
      header: <T className="tt-ce ws-np">profile</T>,
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
        extend={viewPortSize === 'sm'}
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
        extend={viewPortSize === 'sm'}
        key="update profile"
      >
        <T className="ws-np">update profile</T>
      </Button>,
    ] : []),
  ];
  
  const breadcrumbs: TwoContentLayoutProps<ProfileTab>['breadcrumbs'] = ({ selectedTabKey }) => [
    <Link
      href={ROUTES.PROFILE.PAGE(nickname as string, ProfileTab.PROFILE)}
      className="link"
      key="nickname"
    >
      {nickname}
    </Link>,
    renderReactNodeOrFunctionP1(tabHeaders[selectedTabKey]?.header, { selectedTabKey }),
  ];
  
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
            replaceRoute(ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE));
          } else {
            await reloadProfile();
            await mutatePing();
          }
        }}
      />
      <TwoContentLayout
        breadcrumbs={breadcrumbs}
        tabs={tabHeaders}
        tabButtons={extraNodes}
      >
        <h1>{nickname}</h1>
      </TwoContentLayout>
    </>
  );
}
