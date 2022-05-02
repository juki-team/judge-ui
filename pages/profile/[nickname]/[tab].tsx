import { Button, EditIcon, FetcherLayer, LockIcon, Profile, ProfileSubmissions, T, Tabs, TwoContentLayout } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ProblemTab, ProfileTab } from 'types';
import { ChangePasswordModal } from '../../../components/profile/ChangePasswordModal';
import Custom404 from '../../404';

export default function ProfileView() {
  
  const { query, push } = useRouter();
  const { tab, nickname, ...restQuery } = query;
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(nickname && JUDGE_API_V1.ACCOUNT.USER(nickname as string));
  const user = useUserState();
  const [modalChangePassword, setModalChangePassword] = useState(false);
  
  // console.log({ data, tab, nickname, query });
  const index = {
    [ProfileTab.PROFILE]: 0,
    [ProfileTab.SUBMISSIONS]: 1,
  };
  const tabs = [ProfileTab.PROFILE, ProfileTab.SUBMISSIONS];
  const tabHeaders = [
    { children: <T className="text-capitalize">profile</T> },
  ];
  
  if (user.nickname === nickname) {
    tabHeaders.push({ children: <T className="text-capitalize">my submissions</T> });
    // index[ProfileTab.SETTINGS] = tabs.length;
    // tabHeaders.push({ children: <T className="text-capitalize">settings</T> });
    // tabs.push(ProfileTab.SETTINGS);
  } else {
    tabHeaders.push({ children: <T className="text-capitalize">submissions</T> });
  }
  
  const onClose = () => setModalChangePassword(false);
  
  return (
    <FetcherLayer<ContentResponseType<any>>
      isLoading={isLoading}
      data={data}
      error={<Custom404 />}
    >
      {data => (
        <TwoContentLayout>
          <div className="jk-row left gap">
            <h1>{data?.content?.nickname}</h1>
            {modalChangePassword && <ChangePasswordModal onClose={onClose} />}
          </div>
          <Tabs
            selectedTabIndex={index[query.tab as ProblemTab]}
            tabHeaders={tabHeaders}
            onChange={index => push({ pathname: ROUTES.PROFILE.PAGE(nickname as string, tabs[index]), query })}
            actionsSection={
              user.nickname === nickname ? <div className="jk-row gap">
                <Button size="small" className="screen md lg hg">update my data</Button>
                <Button size="small" className="screen md lg hg" onClick={() => setModalChangePassword(true)}>change password</Button>
                <EditIcon className="screen sm" />
                <LockIcon className="screen sm" />
              </div> : null
            }
          >
            <Profile user={data?.content} />
            <ProfileSubmissions />
          </Tabs>
        </TwoContentLayout>
      )}
    </FetcherLayer>
  );
}

