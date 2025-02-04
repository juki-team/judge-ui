'use client';

import {
  ContestsAllList,
  ContestsEndlessList,
  ContestsLiveList,
  ContestsPastList,
  ContestsUpcomingList,
  CreateContestButton,
  T,
  TwoContentLayout,
} from 'components';
import { jukiAppRoutes } from 'config';
import { useEffect, useJukiRouter, useJukiUser, useTrackLastPath } from 'hooks';
import { ContestsTab, LastPathKey, TabsType } from 'types';

export default function ContestsPage() {
  
  useTrackLastPath(LastPathKey.CONTESTS);
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const { searchParams, setSearchParams } = useJukiRouter();
  const contestsTab = searchParams.get('tab') as ContestsTab;
  const { user: { permissions: { contests: { create: canCreateContest } } } } = useJukiUser();
  useEffect(() => {
    if (![
      ContestsTab.ALL,
      ContestsTab.ENDLESS,
      ContestsTab.LIVE,
      ContestsTab.UPCOMING,
      ContestsTab.PAST,
    ].includes(contestsTab as ContestsTab)) {
      setSearchParams({ name: 'tab', value: ContestsTab.ALL, replace: true });
    }
  }, [ contestsTab, setSearchParams ]);
  
  const tabs: TabsType<ContestsTab> = {
    [ContestsTab.ALL]: {
      body: <ContestsAllList />,
      key: ContestsTab.ALL,
      header: <T className="tt-se ws-np">all</T>,
    },
    [ContestsTab.ENDLESS]: {
      body: <ContestsEndlessList />,
      key: ContestsTab.ENDLESS,
      header: <T className="tt-se ws-np">endless</T>,
    },
    [ContestsTab.LIVE]: {
      body: <ContestsLiveList />,
      key: ContestsTab.LIVE,
      header: <T className="tt-se ws-np">live</T>,
    },
    [ContestsTab.UPCOMING]: {
      body: <ContestsUpcomingList />,
      key: ContestsTab.UPCOMING,
      header: <T className="tt-se ws-np">upcoming</T>,
    },
    [ContestsTab.PAST]: {
      body: <ContestsPastList />,
      key: ContestsTab.PAST,
      header: <T className="tt-se ws-np">past</T>,
    },
  };
  
  const extraNodes = [];
  
  if (canCreateContest) {
    extraNodes.push(<CreateContestButton />);
  }
  
  return (
    <TwoContentLayout
      tabs={tabs}
      tabButtons={extraNodes}
      selectedTabKey={contestsTab as ContestsTab}
      getHrefOnTabChange={(tab) => jukiAppRoutes.JUDGE().contests.list() + `?tab=${tab}`}
    >
      <h1><T className="tt-se">contests</T></h1>
    </TwoContentLayout>
  );
}
