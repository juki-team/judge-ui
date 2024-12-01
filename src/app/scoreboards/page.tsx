'use client';

import { DataViewer, T, TwoContentLayout } from 'components';
import { jukiApiSocketManager, jukiGlobalStore } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl } from 'helpers';
import { useDataViewerRequester, useFetcher, useJukiRouter, useJukiUI, useJukiUser, useMemo } from 'hooks';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestDataResponseDTO,
  ContestSummaryListResponseDTO,
  DataViewerHeadersType,
  EntityState,
  QueryParam,
  ScoreboardResponseDTO,
  TabsType,
} from 'types';
import {
  getNicknameColumn,
  getPointsColumn,
  getPositionColumn,
  getProblemScoreboardColumn,
} from '../../components/contest/view/columns';

function Ranking() {
  
  const { viewPortSize } = useJukiUI();
  const { data: globalContestsData } = useFetcher<ContentsResponseType<ContestSummaryListResponseDTO>>(jukiApiSocketManager.API_V1.contest.getSummaryList({
    params: {
      page: 1,
      pageSize: 100,
      filterUrl: toFilterUrl({
        state: EntityState.RELEASED,
        global: 'true',
      }),
    },
  }).url);
  const globalContests = globalContestsData?.success ? globalContestsData.contents : [];
  const { searchParams } = useJukiRouter();
  const tab = searchParams.get('tab') as string || globalContests[0]?.key || '';
  
  const { data: contestResponse } = useFetcher<ContentResponseType<ContestDataResponseDTO>>(tab ? jukiApiSocketManager.API_V1.contest.getData({
    params: {
      key: tab,
    },
  }).url : null);
  const contestData = contestResponse?.success ? contestResponse.content : null;
  const { user } = useJukiUser();
  const { components: { Link } } = useJukiUI();
  const { t } = jukiGlobalStore.getI18n();
  
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortSize, user.nickname),
      getPointsColumn(viewPortSize, true),
    ];
    
    for (const problem of Object.values(contestData?.problems ?? {})) {
      base.push(getProblemScoreboardColumn(Link, tab as string, true, problem, t));
    }
    return base;
  }, [ viewPortSize, user.nickname, contestData, tab, t, Link ]);
  
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
    reload,
    reloadRef,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD(tab ?? '', true), { refreshInterval: 60000 },
  );
  
  const data: ScoreboardResponseDTO[] = (response?.success ? response.contents : []);
  
  const breadcrumbs = [
    <T className="tt-se" key="ranking">scoreboard</T>,
  ];
  
  const tabs: TabsType<string> = {};
  
  for (const globalContest of globalContests) {
    tabs[globalContest.key] = {
      body: (
        <DataViewer<ScoreboardResponseDTO>
          headers={columns}
          data={data}
          rowsView={viewPortSize !== 'sm'}
          rows={{ height: 68 }}
          request={request}
          name={QueryParam.RANKING_TABLE}
          setLoaderStatusRef={setLoaderStatusRef}
          cards={{ height: 240, expanded: true }}
          {...DEFAULT_DATA_VIEWER_PROPS}
        />
      ),
      key: globalContest.key,
      header: globalContest.name,
    };
  }
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabs}
      selectedTabKey={tab}
      getHrefOnTabChange={(value) => `/scoreboard?tab=${value}`}
    >
      <h1><T>scoreboard</T></h1>
    </TwoContentLayout>
  );
}

export default Ranking;
