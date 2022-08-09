import { FetcherLayer, Profile, ProfileSubmissions, T, Tabs, TwoContentLayout } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { ContentResponseType, ProfileTab } from 'types';
import Custom404 from '../../404';

export default function ProfileView() {
  
  const { query, push } = useRouter();
  const { tab, nickname, ...restQuery } = query;
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(nickname && JUDGE_API_V1.ACCOUNT.USER(nickname as string));
  const user = useUserState();
  
  return (
    <FetcherLayer<ContentResponseType<any>>
      isLoading={isLoading}
      data={data}
      error={<Custom404 />}
    >
      {data => {
        const tabHeaders = [
          {
            key: ProfileTab.PROFILE,
            header: <T className="text-capitalize">profile</T>,
            body: <Profile user={data?.content} />,
          }, {
            key: ProfileTab.SUBMISSIONS,
            header: user.nickname === nickname ? <T className="text-capitalize">my submissions</T> :
              <T className="text-capitalize">submissions</T>,
            body: <ProfileSubmissions />,
          },
        ];
        return (
          <TwoContentLayout>
            <div className="jk-row left gap">
              <h1>{data?.content?.nickname}</h1>
            </div>
            <Tabs
              selectedTabKey={query.tab as ProfileTab}
              tabs={tabHeaders}
              onChange={tabKey => push({ pathname: ROUTES.PROFILE.PAGE(nickname as string, tabKey), query })}
            />
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
}

