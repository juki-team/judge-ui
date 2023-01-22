import {
  Breadcrumbs,
  Button,
  ChangePasswordModal,
  EditProfileModal,
  FetcherLayer,
  LockIcon,
  Profile,
  ProfileSubmissions,
  ResetPassword,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useJukiBase } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ContentResponseType, ProfileTab, UserProfileResponseDTO } from 'types';
import Custom404 from '../../404';

export default function ProfileView() {
  
  const { query, push } = useRouter();
  const { nickname, tab } = query;
  const { user: { nickname: userNickname } } = useJukiBase();
  const [openModal, setOpenModal] = useState('');
  const onClose = () => setOpenModal('');
  
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname && JUDGE_API_V1.USER.PROFILE(nickname as string)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        const tabHeaders = {
          [ProfileTab.PROFILE]: {
            key: ProfileTab.PROFILE,
            header: <T className="tt-ce">profile</T>,
            body: (
              <div className="pad-top-bottom pad-left-right">
                <Profile user={data?.content} />
              </div>
            ),
          },
          [ProfileTab.SUBMISSIONS]: {
            key: ProfileTab.SUBMISSIONS,
            header: userNickname === nickname ? <T className="tt-ce">my submissions</T> :
              <T className="tt-ce">submissions</T>,
            body: (
              <div className="pad-top-bottom pad-left-right">
                <ProfileSubmissions />
              </div>
            ),
          },
        };
  
        const pushTab = tabKey => push({ pathname: ROUTES.PROFILE.PAGE(nickname as string, tabKey), query });
        const extraNodes = [
          ...(data.content?.canUpdatePassword ? [
            <Button size="tiny" icon={<LockIcon />} onClick={() => setOpenModal('UPDATE_PASSWORD')}>
              <T className="ws-np">update password</T>
            </Button>,
          ] : []),
          ...(data.content?.canResetPassword ? [
            <Button size="tiny" icon={<LockIcon />} onClick={() => setOpenModal('RESET_PASSWORD')}>
              <T className="ws-np">reset password</T>
            </Button>,
          ] : []),
          ...(data.content?.canEditProfileData ? [
            <Button size="tiny" icon={<LockIcon />} onClick={() => setOpenModal('DATA')}>
              <T className="ws-np">update profile</T>
            </Button>,
          ] : []),
        ];
  
        const breadcrumbs = [
          <Link href="/" className="link"><T className="tt-se">home</T></Link>,
        ];
  
        return (
          <TwoContentSection>
            <div>
              {openModal === 'UPDATE_PASSWORD' && <ChangePasswordModal onClose={onClose} />}
              {openModal === 'RESET_PASSWORD' && <ResetPassword onClose={onClose} nickname={data.content?.nickname} />}
              {openModal === 'DATA' && <EditProfileModal onClose={onClose} user={data.content} />}
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="pad-left-right">
                <h1>{nickname}</h1>
              </div>
              <div className="pad-left-right">
                <TabsInline tabs={tabHeaders} tabSelected={tab} pushTab={pushTab} extraNodes={extraNodes} />
              </div>
            </div>
            {tabHeaders[tab as ProfileTab]?.body}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
}
