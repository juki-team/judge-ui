'use client';

import {
  ButtonLoader,
  ContentCopyIcon,
  EditIcon,
  EditViewMembers,
  FirstLoginWrapper,
  NavigateBeforeIcon,
  NavigateNextIcon,
  Popover,
  ProblemView,
  SpectatorInformation,
  T,
  TwoContentLayout,
  ViewOverview,
  ViewProblems,
} from 'components';
import { jukiApiSocketManager, jukiAppRoutes, jukiGlobalStore } from 'config';
import { JUDGE_API_V1, LS_INITIAL_CONTEST_KEY } from 'config/constants';
import {
  authorizedRequest,
  cleanRequest,
  contestStateMap,
  renderReactNodeOrFunctionP1,
  toUpsertContestDTOUI,
} from 'helpers';
import {
  useEffect,
  useJukiNotification,
  useJukiRouter,
  useJukiTask,
  useJukiUI,
  useJukiUser,
  useMutate,
  usePreload,
  useTrackLastPath,
} from 'hooks';
import { ReactNode } from 'react';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  ContestTab,
  LastPathKey,
  Status,
  TabsType,
  UpsertContestDTOUI,
} from 'src/types';
import { KeyedMutator } from 'swr';
import { getContestTimeLiteral } from '../commons';
import { ViewClarifications } from './ViewClarifications';
import { ViewScoreboard } from './ViewScoreboard';
import { ViewSubmissions } from './ViewSubmissions';

export function ContestView({ contest, reloadContest }: {
  contest: ContestDataResponseDTO,
  reloadContest: KeyedMutator<any>
}) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const { pushRoute, searchParams } = useJukiRouter();
  const contestKey = contest.key;
  const contestTab = (searchParams.get('tab') || ContestTab.OVERVIEW) as ContestTab;
  const problemIndex = searchParams.get('subTab') || '';
  const { viewPortSize, components: { Link } } = useJukiUI();
  const { user: { permissions: { contests: { create: canCreateContest } } } } = useJukiUser();
  const { t } = jukiGlobalStore.getI18n();
  const { listenSubmission } = useJukiTask();
  const mutate = useMutate();
  const { addWarningNotification, notifyResponse } = useJukiNotification();
  
  const {
    user: { isAdministrator, isManager, isParticipant, isGuest, isSpectator },
  } = contest;
  const key = [ contest.isPast, contest.isLive, contest.isFuture, contest.isEndless ].toString();
  const statusLabel = contestStateMap[key].label;
  const tag = contestStateMap[key].color;
  const literal = getContestTimeLiteral(contest);
  
  const allLiteralLabel = contest.isEndless
    ? <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
      <T>{statusLabel}</T></div>
    : <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
      <T>{statusLabel}</T>,&nbsp;{literal}</div>;
  
  const tabHeaders: TabsType<ContestTab> = {
    [ContestTab.OVERVIEW]: {
      key: ContestTab.OVERVIEW,
      header: <T className="tt-ce ws-np">overview</T>,
      body: <ViewOverview contest={contest} reloadContest={reloadContest} />,
    },
  };
  
  const problems = Object.values(contest.problems);
  problems.sort((problemA, problemB) => problemA.index.localeCompare(problemB.index));
  const problemArrayIndex = problems.findIndex(problem => problem.index === problemIndex);
  const problem = problems[problemArrayIndex];
  
  const preload = usePreload();
  const canViewContest = isAdministrator || isManager || contest.isLive || contest.isPast || contest.isEndless;
  useEffect(() => {
    if (canViewContest) {
      void preload(JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, false));
    }
  }, [ canViewContest, contest?.key, preload ]);
  
  if (canViewContest) {
    if (problemArrayIndex !== -1) {
      tabHeaders[ContestTab.PROBLEMS] = {
        key: ContestTab.PROBLEMS,
        header: (
          <div className="jk-row gap nowrap">
            <NavigateBeforeIcon
              style={{ padding: 0 }}
              className="clickable jk-br-ie"
              onClick={async (event) => {
                event.stopPropagation();
                const previousProblemIndex = problems[(problemArrayIndex - 1 + problems.length) % problems.length]?.index;
                pushRoute(jukiAppRoutes.JUDGE().contests.view({
                  key: contest.key,
                  tab: ContestTab.PROBLEMS,
                  subTab: previousProblemIndex,
                }));
              }}
            />
            <T className="tt-ce ws-np">problem</T> {problemIndex}
            <NavigateNextIcon
              style={{ padding: 0 }}
              className="clickable jk-br-ie"
              onClick={async (event) => {
                event.stopPropagation();
                const nextProblemIndex = problems[(problemArrayIndex + 1) % problems.length]?.index;
                pushRoute(jukiAppRoutes.JUDGE().contests.view({
                  key: contest.key,
                  tab: ContestTab.PROBLEMS,
                  subTab: nextProblemIndex,
                }));
              }}
            />
          </div>
        ),
        body: (
          <ProblemView
            key="problem-view"
            problem={{
              ...problem,
              user: { isOwner: false, isManager: false, tried: false, isSpectator: false, solved: false },
            }}
            infoPlacement="name"
            withoutDownloadButtons
            codeEditorSourceStoreKey={contest.key + '/' + problem.key}
            codeEditorCenterButtons={({ sourceCode, language }) => {
              const validSubmit = (
                <ButtonLoader
                  type="secondary"
                  size="tiny"
                  disabled={sourceCode === ''}
                  onClick={async setLoaderStatus => {
                    setLoaderStatus(Status.LOADING);
                    const { url, ...options } = jukiApiSocketManager.API_V1.contest.submit({
                      params: {
                        key: contest.key,
                        problemKey: problem.key,
                      }, body: { language: language as string, source: sourceCode },
                    });
                    const response = cleanRequest<ContentResponseType<any>>(
                      await authorizedRequest(url, options),
                    );
                    if (notifyResponse(response, setLoaderStatus)) {
                      listenSubmission({
                        id: response.content.submitId,
                        problem: { name: problem.name },
                        contest: { name: contest.name, problemIndex },
                      }, true);
                      pushRoute(jukiAppRoutes.JUDGE().contests.view({
                        key: contestKey,
                        tab: ContestTab.MY_SUBMISSIONS,
                        subTab: problemIndex,
                      }));
                      await mutate(new RegExp(`${jukiApiSocketManager.SERVICE_API_V1_URL}/submission`, 'g'));
                    }
                  }}
                >
                  {isAdministrator || isManager ? <T>submit as judge</T> : <T>submit</T>}
                </ButtonLoader>
              );
              if (isAdministrator || isManager || isParticipant) {
                return (
                  <FirstLoginWrapper>
                    {validSubmit}
                  </FirstLoginWrapper>
                );
              }
              if (isGuest) {
                return (
                  <ButtonLoader
                    type="secondary"
                    size="tiny"
                    onClick={() => {
                      addWarningNotification(<T className="tt-se">to submit, first register</T>);
                      pushRoute(jukiAppRoutes.JUDGE().contests.view({
                        key: contestKey,
                        tab: ContestTab.OVERVIEW,
                        subTab: problemIndex,
                      }));
                    }}
                  >
                    <T>submit</T>
                  </ButtonLoader>
                );
              }
              if (isSpectator) {
                return <SpectatorInformation />;
              }
              
              return null;
            }}
          />
        ),
      };
    } else {
      tabHeaders[ContestTab.PROBLEMS] = {
        key: ContestTab.PROBLEMS,
        header: (
          <div className="jk-row gap nowrap">
            <T className="tt-ce ws-np">problems</T>
          </div>
        ),
        body: <ViewProblems key="problems-view" contest={contest} />,
      };
    }
    tabHeaders[ContestTab.SCOREBOARD] = {
      key: ContestTab.SCOREBOARD,
      header: <T className="tt-ce ws-np">scoreboard</T>,
      body: <ViewScoreboard key="scoreboard" contest={contest} mutate={reloadContest} />,
    };
  }
  
  if (canViewContest) {
    tabHeaders[ContestTab.SUBMISSIONS] = {
      key: ContestTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: <ViewSubmissions key="submissions" contest={contest} />,
    };
  }
  
  if (contest.settings.clarifications) {
    tabHeaders[ContestTab.CLARIFICATIONS] = {
      key: ContestTab.CLARIFICATIONS,
      header: <T className="tt-ce ws-np">clarifications</T>,
      body: <ViewClarifications key="clarifications" contest={contest} />,
    };
  }
  
  if (isAdministrator || isManager || contest.isPast || contest.isEndless) {
    tabHeaders[ContestTab.MEMBERS] = {
      key: ContestTab.MEMBERS,
      header: <T className="tt-ce">members</T>,
      body: (
        <EditViewMembers key="members" contest={contest as unknown as UpsertContestDTOUI} />
      ),
    };
  }
  
  const extraNodes = [];
  if (viewPortSize === 'hg') {
    extraNodes.push(
      <div className={`jk-row nowrap jk-tag ${tag}`} key="status-label">
        {contest.isEndless
          ? <T className="ws-np">{statusLabel}</T>
          : <><T className="ws-np">{statusLabel}</T>,&nbsp;{literal}</>}
      </div>,
    );
  }
  
  if (canCreateContest && contest.isPast) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          const { name, ...parsedContest } = toUpsertContestDTOUI(contest);
          localStorage.setItem(LS_INITIAL_CONTEST_KEY, JSON.stringify({
            ...parsedContest,
            key: `${key}-${t('copy')}`,
            name: `${name} (${t('COPY')})`,
          }));
          pushRoute(jukiAppRoutes.JUDGE().contests.new());
          setLoaderStatus(Status.SUCCESS);
        }}
        icon={<ContentCopyIcon />}
        responsiveMobile
        type="light"
        key="copy"
      >
        <T className="ws-np">copy</T>
      </ButtonLoader>,
    );
  }
  
  if (isAdministrator) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          pushRoute(jukiAppRoutes.JUDGE().contests.edit({ key: contestKey }));
          setLoaderStatus(Status.SUCCESS);
        }}
        icon={<EditIcon />}
        responsiveMobile
        key="edit"
      >
        <T>edit</T>
      </ButtonLoader>,
    );
  }
  
  const breadcrumbs: ReactNode[] = [
    <Link
      href={jukiAppRoutes.JUDGE().contests.list()}
      className="link"
      key="contest.name"
    >
      <T className="tt-se">contests</T>
    </Link>,
    <Link
      href={jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab: ContestTab.OVERVIEW, subTab: problemIndex })}
      className="link"
      key="contest.name"
    >
      <div className="ws-np">{contest.name}</div>
    </Link>,
  ];
  if (contestTab === ContestTab.PROBLEMS && problemArrayIndex !== -1) {
    breadcrumbs.push(
      <Link
        href={jukiAppRoutes.JUDGE().contests.view({
          key: contestKey,
          tab: ContestTab.PROBLEMS,
        })}
        className="link"
      >
        <T className="tt-se">problems</T>
      </Link>,
    );
    breadcrumbs.push(<div>{problemIndex}</div>);
  } else {
    breadcrumbs.push(renderReactNodeOrFunctionP1(tabHeaders[contestTab]?.header, { selectedTabKey: contestTab }));
  }
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabHeaders}
      selectedTabKey={contestTab}
      getHrefOnTabChange={tab => jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab, subTab: problemIndex })}
      tabButtons={extraNodes}
    >
      {/*<CustomHead title={contest.name} />*/}
      <div className="jk-row nowrap gap extend left">
        <h2
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {contest.name}
        </h2>
        <Popover
          content={<div className="jk-pg-sm">{literal}</div>}
          placement="bottom"
        >
          <div className={`jk-tag tt-ue tx-s ${tag} screen md lg`}>
            <T className="ws-np">{statusLabel}</T>
          </div>
        </Popover>
      </div>
      <div className="screen sm jk-row extend">{allLiteralLabel}</div>
    </TwoContentLayout>
  );
}
