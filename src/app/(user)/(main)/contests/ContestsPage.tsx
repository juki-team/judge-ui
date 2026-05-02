'use client';

import { CreateContestButton } from 'components';
import { T, TwoContentLayout, useRouterStore, useTrackLastPath, useUserStore } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { useEffect } from 'hooks';
import { LastPathKey } from 'types';
import { ContestsTab } from '@juki-team/base-ui/enums';
import { type PagedDataViewerProps, type TabsType } from '@juki-team/base-ui/types';
import { type ContestSummaryListResponseDTO } from '@juki-team/commons/dto';
import { ContestsClassicList } from '../../../../components/contest/list/ContestsClassicList';
import { ContestsGlobalList } from '../../../../components/contest/list/ContestsGlobalList';

export function ContestsPage({ tab }: { tab?: ContestsTab }) {
  
  useTrackLastPath(LastPathKey.CONTESTS);
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  
  const setSearchParams = useRouterStore(state => state.setSearchParams);
  const userCanCreateContest = useUserStore(state => state.user.permissions.contests.create);
  useEffect(() => {
    if (!tab || ![
      ContestsTab.GLOBALS,
      ContestsTab.CLASSICS,
    ].includes(tab)) {
      setSearchParams({ name: 'tab', value: ContestsTab.CLASSICS }, true);
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
    [ContestsTab.CLASSICS]: {
      body: <ContestsClassicList {...props} />,
      key: ContestsTab.CLASSICS,
      header: <T className="tt-se ws-np">classics</T>,
    },
    [ContestsTab.GLOBALS]: {
      body: <ContestsGlobalList  {...props} />,
      key: ContestsTab.GLOBALS,
      header: <T className="tt-se ws-np">globals</T>,
    },
  };
  
  return (
    <TwoContentLayout
      tabs={tabs}
      selectedTabKey={tab}
      getHrefOnTabChange={(tab) => jukiAppRoutes.JUDGE().contests.list({ tab })}
    >
      <h1><T className="tt-se">contests</T></h1>
    </TwoContentLayout>
  );
}
