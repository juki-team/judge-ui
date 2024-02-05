import { jukiSettings } from '@juki-team/base-ui';
import {
  Breadcrumbs,
  Button,
  ChangePasswordModal,
  EditProfileModal,
  FetcherLayer,
  HomeLink,
  LockIcon,
  MyActiveSessions,
  ProfileSubmissions,
  ResetPassword,
  T,
  TabsInline,
  TwoContentSection,
  UserProfile,
  UserProfileSettings,
} from 'components';
import { ROUTES } from 'config/constants';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter, useJukiUI, useJukiUser, useState } from 'hooks';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ContentResponseType, ProfileTab, TabsType, UserProfileResponseDTO } from 'types';
import Custom404 from '../../../404';

export default function ProfileView() {
  
  const { searchParams, routeParams: { nickname, tab }, pushRoute } = useJukiRouter();
  const { user: { nickname: userNickname }, company } = useJukiUser();
  const [ openModal, setOpenModal ] = useState('');
  const { viewPortSize } = useJukiUI();
  const onClose = () => setOpenModal('');
  
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname ? jukiSettings.API.user.getProfile({ params: { nickname: nickname as string } }).url : null}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        const tabHeaders: TabsType<ProfileTab> = {
          [ProfileTab.PROFILE]: {
            key: ProfileTab.PROFILE,
            header: <T className="tt-ce ws-np">profile</T>,
            body: (
              <div className="pad-top-bottom pad-left-right">
                <UserProfile user={data?.content} />
              </div>
            ),
          },
        };
        if (data?.content?.nickname === userNickname) {
          tabHeaders[ProfileTab.SETTINGS] = {
            key: ProfileTab.SETTINGS,
            header: <T className="tt-ce ws-np">settings</T>,
            body: (
              <div className="pad-top-bottom pad-left-right">
                <UserProfileSettings
                  user={data?.content}
                  onClickUpdatePassword={() => setOpenModal('UPDATE_PASSWORD')}
                />
              </div>
            ),
          };
          tabHeaders[ProfileTab.MY_SESSIONS] = {
            key: ProfileTab.MY_SESSIONS,
            header: <T className="tt-ce ws-np">my sessions</T>,
            body: (
              <div className="pad-top-bottom pad-left-right">
                <MyActiveSessions />
              </div>
            ),
          };
          
        }
        tabHeaders[ProfileTab.SUBMISSIONS] = {
          key: ProfileTab.SUBMISSIONS,
          header: userNickname === nickname
            ? <T className="tt-ce ws-np">my submissions</T>
            : <T className="tt-ce ws-np">submissions</T>,
          body: (
            <div className="pad-top-bottom pad-left-right">
              <ProfileSubmissions />
            </div>
          ),
        };
        
        const pushTab = (tabKey: ProfileTab) => pushRoute({
          pathname: ROUTES.PROFILE.PAGE(nickname as string, tabKey),
          searchParams,
        });
        
        const extraNodes = [
          ...(data.content?.canResetPassword ? [
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
          ...(data.content?.canEditProfileData ? [
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
        
        const breadcrumbs: ReactNode[] = [
          <HomeLink key="home" />,
          <Link
            href={ROUTES.PROFILE.PAGE(nickname as string, ProfileTab.PROFILE)}
            className="link"
            key="nickname"
          >
            {nickname}
          </Link>,
          renderReactNodeOrFunctionP1(tabHeaders[tab as ProfileTab]?.header, { selectedTabKey: tab as ProfileTab }),
        ];
        
        return (
          <TwoContentSection>
            <div>
              <ChangePasswordModal isOpen={openModal === 'UPDATE_PASSWORD'} onClose={onClose} />
              {openModal === 'RESET_PASSWORD' && (
                <ResetPassword onClose={onClose} nickname={data.content?.nickname} companyKey={company.key} />
              )}
              <EditProfileModal isOpen={openModal === 'DATA'} onClose={onClose} user={data.content} />
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="pad-left-right">
                <h1>{nickname}</h1>
              </div>
              <div className="pad-left-right">
                <TabsInline
                  tabs={tabHeaders}
                  selectedTabKey={tab as ProfileTab}
                  onChange={pushTab}
                  extraNodes={extraNodes}
                  extraNodesPlacement={(viewPortSize === 'sm') ? 'bottomRight' : undefined}
                />
              </div>
            </div>
            {renderReactNodeOrFunctionP1(tabHeaders[tab as ProfileTab]?.body, { selectedTabKey: tab as ProfileTab })}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
}
