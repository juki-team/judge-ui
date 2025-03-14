'use client';

import { ProblemTab } from '@juki-team/base-ui/types';
import { Button, DataViewer, T, TwoContentLayout } from 'components';
import { jukiApiSocketManager, jukiAppRoutes, jukiGlobalStore } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, ROUTES } from 'config/constants';
import { toFilterUrl } from 'helpers';
import {
  useDataViewerRequester,
  useFetcher,
  useJukiRouter,
  useJukiUI,
  useJukiUser,
  useMemo,
  useTrackLastPath,
} from 'hooks';
import { CSSProperties } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestDataResponseDTO,
  ContestSummaryListResponseDTO,
  DataViewerHeadersType,
  EntityState,
  LastPathKey,
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

const Scoreboard = ({ contest }: { contest: ContestSummaryListResponseDTO }) => {
  
  const { data: contestResponse } = useFetcher<ContentResponseType<ContestDataResponseDTO>>(jukiApiSocketManager.API_V1.contest.getData({
    params: {
      key: contest.key,
    },
  }).url);
  const contestData = contestResponse?.success ? contestResponse.content : null;
  const { user: { nickname, permissions: { services: { administrate: canAdministrateServices } } } } = useJukiUser();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const { t } = jukiGlobalStore.getI18n();
  const contestTags = JSON.stringify(contest.tags ?? []);
  
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortSize, nickname),
      getPointsColumn(viewPortSize, true),
    ];
    
    const tags = JSON.parse(contestTags);
    
    for (const problem of Object.values(contestData?.problems ?? {})) {
      let group = '';
      for (const tag of problem.tags) {
        if (tags.includes(tag)) {
          group = tag;
        }
      }
      base.push({
        ...getProblemScoreboardColumn(Link, contest.key, true, problem, t),
        group,
        head: (
          <div
            data-tooltip-id="jk-tooltip"
            data-tooltip-content={`${problem.name}`}
            data-tooltip-t-class-name="ws-np"
            className="jk-col extend fw-bd is-first-accepted"
            style={{ '--balloon-color': problem.color } as CSSProperties}
          >
            <Link
              href={jukiAppRoutes.JUDGE().problems.view({
                key: problem.key,
                tab: ProblemTab.STATEMENT,
              })}
            >
              {problem.shortname || problem.name}
            </Link>
          </div>
        ),
      });
    }
    return base;
  }, [ viewPortSize, nickname, contestData?.problems, Link, contest.key, t, contestTags ]);
  
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
    reload,
    reloadRef,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD(contest.key, true), { refreshInterval: 60000 },
  );
  
  const data: ScoreboardResponseDTO[] = (response?.success ? response.contents : []);
  
  return (
    <DataViewer<ScoreboardResponseDTO>
      extraNodes={canAdministrateServices ? [
        <Link href={jukiAppRoutes.JUDGE().contests.view({ key: contest.key })} key="edit">
          <Button size="tiny" type="light">
            <T>edit</T></Button>
        </Link>,
      ] : []}
      headers={columns}
      groups={contest.isGlobal ? contest.tags.map(tag => ({
        key: tag,
        label: <div className="jk-row fw-bd">{tag}</div>,
      })) : undefined}
      data={data}
      rowsView={viewPortSize !== 'sm'}
      rows={{ height: 68 }}
      request={request}
      name={QueryParam.RANKING_TABLE}
      setLoaderStatusRef={setLoaderStatusRef}
      cards={{ height: 240, expanded: true }}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};

function Boards() {
  
  useTrackLastPath(LastPathKey.BOARDS);
  
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
  
  const tabs: TabsType<string> = {};
  
  for (const globalContest of globalContests) {
    tabs[globalContest.key] = {
      body: <Scoreboard contest={globalContest} />,
      key: globalContest.key,
      header: <div>{globalContest.name}</div>,
    };
  }
  
  return (
    <TwoContentLayout
      tabs={tabs}
      selectedTabKey={tab}
      getHrefOnTabChange={(value) => ROUTES.BOARDS.PAGE(value)}
    >
      <h1><T className="tt-se">boards</T></h1>
    </TwoContentLayout>
  );
}

export default Boards;
