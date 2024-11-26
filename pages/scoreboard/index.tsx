import { DataViewer, T, TwoContentLayout } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { useDataViewerRequester, useFetcher, useJukiRouter, useJukiUI, useJukiUser, useMemo } from 'hooks';
import {
  ContentsResponseType,
  ContestSummaryListResponseDTO,
  DataViewerHeadersType,
  EntityState,
  QueryParam,
  ScoreboardResponseDTO,
  TabsType,
} from 'types';
import { getNicknameColumn, getPointsColumn, getPositionColumn } from '../../components/contest/view/columns';
import { jukiSettings } from '../../config';
import { toFilterUrl } from '../../helpers';

function Ranking() {
  
  const { viewPortSize } = useJukiUI();
  const { data: globalContestsData } = useFetcher<ContentsResponseType<ContestSummaryListResponseDTO>>(jukiSettings.API.contest.getSummaryList({
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
  const globalContest = globalContests.find(globalContest => globalContest.key === tab);
  const { user } = useJukiUser();
  
  console.log({ globalContests });
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortSize, user.nickname),
      getPointsColumn(viewPortSize, true),
    ];
    
    // if (globalContest?.problems) {
    //   for (const problem of Object.values(globalContest?.problems)) {
    //     base.push(getProblemScoreboardColumn(Link, contestKey as string, contest.isEndless, problem, t));
    //   }
    // }
    return base;
  }, [ viewPortSize, user.nickname /*contest.isEndless, contest?.problems, Link, contestKey, t*/ ]);
  
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
    reload,
    reloadRef,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD(globalContest?.key ?? '', true), { refreshInterval: 60000 },
  );
  
  const data: ScoreboardResponseDTO[] = (response?.success ? response.contents : []);
  console.log({ data });
  
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
  
  console.log({ tabs });
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
