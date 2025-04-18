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
import { useEffect, useRouterStore, useTrackLastPath, useUserStore } from 'hooks';
import { ContestsTab, LastPathKey, TabsType } from 'types';

export function ContestsPage({ tab }: { tab?: ContestsTab }) {
  
  useTrackLastPath(LastPathKey.CONTESTS);
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const setSearchParams = useRouterStore(state => state.setSearchParams);
  const userCanCreateContest = useUserStore(state => state.user.permissions.contests.create);
  useEffect(() => {
    if (!tab || ![
      ContestsTab.ALL,
      ContestsTab.ENDLESS,
      ContestsTab.LIVE,
      ContestsTab.UPCOMING,
      ContestsTab.PAST,
    ].includes(tab)) {
      setSearchParams({ name: 'tab', value: ContestsTab.ALL }, true);
    }
  }, [ tab, setSearchParams ]);
  
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
  
  if (userCanCreateContest) {
    extraNodes.push(<CreateContestButton />);
  }
  
  return (
    <TwoContentLayout
      tabs={tabs}
      tabButtons={extraNodes}
      selectedTabKey={tab}
      getHrefOnTabChange={(tab) => jukiAppRoutes.JUDGE().contests.list() + `?tab=${tab}`}
    >
      <h1><T className="tt-se">contests</T></h1>
    </TwoContentLayout>
  );
}
