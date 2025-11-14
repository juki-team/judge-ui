'use client';

import { CreateContestButton, T, TwoContentLayout } from 'components';
import { jukiAppRoutes } from 'config';
import { useEffect, useRouterStore, useTrackLastPath, useUserStore } from 'hooks';
import { ContestsTab, ContestSummaryListResponseDTO, LastPathKey, PagedDataViewerProps, TabsType } from 'types';
import { ContestsClassicList } from '../../../components/contest/list/ContestsClassicList';
import { ContestsGlobalList } from '../../../components/contest/list/ContestsGlobalList';

export function ContestsPage({ tab }: { tab?: ContestsTab }) {
  
  useTrackLastPath(LastPathKey.CONTESTS);
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  
  const setSearchParams = useRouterStore(state => state.setSearchParams);
  const userCanCreateContest = useUserStore(state => state.user.permissions.contests.create);
  useEffect(() => {
    if (!tab || ![
      ContestsTab.COLLECTIONS,
      ContestsTab.CLASSICS,
    ].includes(tab)) {
      setSearchParams({ name: 'tab', value: ContestsTab.COLLECTIONS }, true);
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
    // [ContestsTab.ALL]: {
    //   body: <ContestsAllList {...props} />,
    //   key: ContestsTab.ALL,
    //   header: <T className="tt-se ws-np">all</T>,
    // },
    [ContestsTab.COLLECTIONS]: {
      body: <ContestsGlobalList  {...props} />,
      key: ContestsTab.COLLECTIONS,
      header: <T className="tt-se ws-np">collections</T>,
    },
    [ContestsTab.CLASSICS]: {
      body: <ContestsClassicList {...props} />,
      key: ContestsTab.CLASSICS,
      header: <T className="tt-se ws-np">classics</T>,
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
