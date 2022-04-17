import { FetcherLayer, Profile, T, Tabs, TwoContentLayout } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { ContentResponseType, ProblemTab, ProfileTab } from 'types';
import Custom404 from '../../404';

export default function ProfileView() {
  
  const { query: { tab, nickname, ...query }, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(nickname && JUDGE_API_V1.ACCOUNT.USER(nickname as string));
  const user = useUserState();
  console.log({ data, tab, nickname, query });
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
    index[ProfileTab.SETTINGS] = tabs.length;
    tabHeaders.push({ children: <T className="text-capitalize">settings</T> });
    tabs.push(ProfileTab.SETTINGS);
  } else {
    tabHeaders.push({ children: <T className="text-capitalize">submissions</T> });
  }
  
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
          </div>
          <Tabs
            selectedTabIndex={index[query.tab as ProblemTab]}
            tabHeaders={tabHeaders}
            onChange={index => push({ pathname: ROUTES.PROFILE.PAGE(nickname as string, tabs[index]), query })}
            // actionsSection={
            //
            // }
          >
            <Profile user={data?.content} />
            <div>2</div>
            <div>3</div>
          </Tabs>
        </TwoContentLayout>
      )}
    </FetcherLayer>
  );
}

