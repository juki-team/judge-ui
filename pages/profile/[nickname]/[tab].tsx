import {
  Button,
  ChangePasswordModal,
  EditProfileModal,
  FetcherLayer,
  LockIcon,
  Profile,
  ProfileSubmissions,
  ResetPassword,
  T,
  Tabs,
  TwoContentLayout,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ProfileTab, UserProfileResponseDTO } from 'types';
import Custom404 from '../../404';

export default function ProfileView() {
  
  const { query, push } = useRouter();
  const { nickname, tab } = query;
  const { nickname: userNickname } = useUserState();
  const [openModal, setOpenModal] = useState('');
  const onClose = () => setOpenModal('');
  
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname && JUDGE_API_V1.USER.PROFILE(nickname as string)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        const tabHeaders = [
          {
            key: ProfileTab.PROFILE,
            header: <T className="tt-ce">profile</T>,
            body: <Profile user={data?.content} />,
          }, {
            key: ProfileTab.SUBMISSIONS,
            header: userNickname === nickname ? <T className="tt-ce">my submissions</T> :
              <T className="tt-ce">submissions</T>,
            body: <ProfileSubmissions />,
          },
        ];
        return (
          <TwoContentLayout>
            <div className="jk-row left gap">
              <h1>{nickname}</h1>
              {openModal === 'UPDATE_PASSWORD' && <ChangePasswordModal onClose={onClose} />}
              {openModal === 'RESET_PASSWORD' && <ResetPassword onClose={onClose} nickname={data.content?.nickname} />}
              {openModal === 'DATA' && <EditProfileModal onClose={onClose} user={data.content} />}
            </div>
            <Tabs
              selectedTabKey={tab as ProfileTab}
              tabs={tabHeaders}
              onChange={tabKey => push({ pathname: ROUTES.PROFILE.PAGE(nickname as string, tabKey), query })}
              // TODO improve:
              extraNodes={[
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
              ]}
            />
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
}
