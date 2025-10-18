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
import { ContestsTab, ContestSummaryListResponseDTO, LastPathKey, PagedDataViewerProps, TabsType } from 'types';

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
  
  const extraNodes = [];
  
  if (userCanCreateContest) {
    extraNodes.push(<CreateContestButton />);
  }
  
  const props: Partial<PagedDataViewerProps<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>> = {
    refreshInterval: 60000,
    cards: { width: 320, expanded: true },
    extraNodes,
  };
  
  const tabs: TabsType<ContestsTab> = {
    [ContestsTab.ALL]: {
      body: <ContestsAllList {...props} />,
      key: ContestsTab.ALL,
      header: <T className="tt-se ws-np">all</T>,
    },
    [ContestsTab.ENDLESS]: {
      body: <ContestsEndlessList  {...props} />,
      key: ContestsTab.ENDLESS,
      header: <T className="tt-se ws-np">endless</T>,
    },
    [ContestsTab.LIVE]: {
      body: <ContestsLiveList {...props} />,
      key: ContestsTab.LIVE,
      header: <T className="tt-se ws-np">live</T>,
    },
    [ContestsTab.UPCOMING]: {
      body: <ContestsUpcomingList {...props} />,
      key: ContestsTab.UPCOMING,
      header: <T className="tt-se ws-np">upcoming</T>,
    },
    [ContestsTab.PAST]: {
      body: <ContestsPastList {...props} />,
      key: ContestsTab.PAST,
      header: <T className="tt-se ws-np">past</T>,
    },
  };
  
  return (
    <TwoContentLayout
      tabs={tabs}
      selectedTabKey={tab}
      getHrefOnTabChange={(tab) => jukiAppRoutes.JUDGE().contests.list() + `?tab=${tab}`}
    >
      <h1><T className="tt-se">contests</T></h1>
    </TwoContentLayout>
  );
}
