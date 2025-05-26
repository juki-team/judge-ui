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
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest, contestStateMap, isGlobalContest, toUpsertContestDTOUI } from 'helpers';
import {
  useI18nStore,
  useJukiNotification,
  useJukiTask,
  useJukiUI,
  useMutate,
  useRouterStore,
  useTrackLastPath,
  useUserStore,
} from 'hooks';
import React from 'react';
import { LS_INITIAL_CONTEST_KEY } from 'src/constants';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  ContestTab,
  EntityState,
  LastPathKey,
  ProblemTab,
  Status,
  TabsType,
  UpsertContestDTOUI,
} from 'types';
import { InfoIcon } from '../../index';
import { getContestTimeLiteral } from '../commons';
import { ViewClarifications } from './ViewClarifications';
import { ViewScoreboard } from './ViewScoreboard';
import { ViewSubmissions } from './ViewSubmissions';

export function ContestView({ contest, reloadContest }: {
  contest: ContestDataResponseDTO,
  reloadContest: KeyedMutator<any>
}) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const searchParams = useRouterStore(state => state.searchParams);
  const contestKey = contest.key;
  const contestTab = (searchParams.get('tab') || ContestTab.OVERVIEW) as ContestTab;
  const problemIndex = searchParams.get('subTab') || '';
  const { viewPortSize, components: { Link } } = useJukiUI();
  const userCanCreateContest = useUserStore(state => state.user.permissions.contests.create);
  const t = useI18nStore(state => state.i18n.t);
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
  
  const canViewContest = isAdministrator || isManager || contest.isLive || contest.isPast || contest.isEndless;
  
  const isGlobal = isGlobalContest(contest.settings);
  if (canViewContest) {
    if (problemArrayIndex !== -1) {
      const previousProblemIndex = problems[(problemArrayIndex - 1 + problems.length) % problems.length]?.index;
      const prevUrl = jukiAppRoutes.JUDGE().contests.view({
        key: contest.key,
        tab: ContestTab.PROBLEMS,
        subTab: previousProblemIndex,
      });
      const nextProblemIndex = problems[(problemArrayIndex + 1) % problems.length]?.index;
      const nextUrl = jukiAppRoutes.JUDGE().contests.view({
        key: contest.key,
        tab: ContestTab.PROBLEMS,
        subTab: nextProblemIndex,
      });
      tabHeaders[ContestTab.PROBLEMS] = {
        key: ContestTab.PROBLEMS,
        header: (
          <div className="jk-row gap nowrap">
            <Link href={jukiAppRoutes.JUDGE().contests.view({ key: contest.key, tab: ContestTab.PROBLEMS })}>
              <T className="tt-ce ws-np clickable jk-br-ie" style={{ padding: '2px 4px' }}>problems</T>
            </Link>
            <Link href={prevUrl} style={{ display: 'contents' }}>
              <NavigateBeforeIcon style={{ padding: 0 }} className="clickable jk-br-ie" />
            </Link>
            {problemIndex}
            <Link href={nextUrl} style={{ display: 'contents' }}>
              <NavigateNextIcon style={{ padding: 0 }} className="clickable jk-br-ie" />
            </Link>
          </div>
        ),
        body: (
          <ProblemView
            key="problem-view"
            problem={{
              ...problem,
              user: { isOwner: false, isManager: false, tried: false, isSpectator: false, solved: false },
              state: EntityState.RELEASED,
            }}
            infoPlacement="name"
            withoutDownloadButtons
            codeEditorStoreKey={contest.key + '/' + problem.key}
            codeEditorCenterButtons={({ sourceCode, language }) => {
              const validSubmit = (
                <ButtonLoader
                  type="secondary"
                  size="tiny"
                  disabled={sourceCode === ''}
                  onClick={async setLoaderStatus => {
                    setLoaderStatus(Status.LOADING);
                    let response;
                    if (isGlobal) {
                      const { url, ...options } = jukiApiSocketManager.API_V1.problem.submit({
                        params: {
                          key: problem.key,
                        }, body: { language: language as string, source: sourceCode },
                      });
                      response = cleanRequest<ContentResponseType<any>>(
                        await authorizedRequest(url, options),
                      );
                    } else {
                      const { url, ...options } = jukiApiSocketManager.API_V1.contest.submit({
                        params: {
                          key: contest.key,
                          problemKey: problem.key,
                        }, body: { language: language as string, source: sourceCode },
                      });
                      response = cleanRequest<ContentResponseType<any>>(
                        await authorizedRequest(url, options),
                      );
                    }
                    
                    if (notifyResponse(response, setLoaderStatus)) {
                      if (isGlobal) {
                        listenSubmission({
                          id: response.content.submitId,
                          problem: { name: problem.name },
                        }, true);
                        pushRoute(jukiAppRoutes.JUDGE().problems.view({
                          key: problem.key,
                          tab: ProblemTab.MY_SUBMISSIONS,
                        }));
                      } else {
                        listenSubmission({
                          id: response.content.submitId,
                          problem: { name: problem.name },
                          contest: { name: contest.name, problemIndex },
                        }, true);
                        pushRoute(jukiAppRoutes.JUDGE().contests.view({
                          key: contestKey,
                          tab: ContestTab.SUBMISSIONS,
                          subTab: problemIndex,
                        }));
                        await mutate(new RegExp(`${jukiApiSocketManager.SERVICE_API_V1_URL}/submission`, 'g'));
                      }
                    }
                  }}
                >
                  {(isAdministrator || isManager) && !isGlobal
                    ? <T className="tt-se">submit as judge</T>
                    : <T className="tt-se">submit</T>}
                </ButtonLoader>
              );
              if (isAdministrator || isManager || isParticipant) {
                return (
                  <div className="jk-row gap">
                    <FirstLoginWrapper>
                      {validSubmit}
                    </FirstLoginWrapper>
                    <Link
                      data-tooltip-id="jk-tooltip"
                      data-tooltip-content="how does it work?"
                      href="https://www.juki.app/docs?page=2&sub_page=2&focus=ef99389d-f48f-415f-b652-38cac0a065b8"
                      target="_blank"
                      className="cr-py"
                    >
                      <div className="jk-row">
                        <InfoIcon size="small" />
                      </div>
                    </Link>
                  </div>
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
                    <T className="tt-se">submit</T>
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
  
  if (canViewContest && !contest.isGlobal) {
    tabHeaders[ContestTab.SUBMISSIONS] = {
      key: ContestTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: <ViewSubmissions key="submissions" contest={contest} />,
    };
  }
  
  if (contest.settings.clarifications && !contest.isGlobal) {
    tabHeaders[ContestTab.CLARIFICATIONS] = {
      key: ContestTab.CLARIFICATIONS,
      header: <T className="tt-ce ws-np">clarifications</T>,
      body: <ViewClarifications key="clarifications" contest={contest} />,
    };
  }
  
  if ((isAdministrator || isManager || contest.isPast || contest.isEndless) && !contest.isGlobal) {
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
  
  if (userCanCreateContest && contest.isPast) {
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
        <T className="ws-np tt-se">copy</T>
      </ButtonLoader>,
    );
  }
  
  if (isAdministrator) {
    extraNodes.push(
      <Link href={jukiAppRoutes.JUDGE().contests.edit({ key: contestKey })}>
        <ButtonLoader
          size="small"
          icon={<EditIcon />}
          responsiveMobile
          key="edit"
        >
          <T>edit</T>
        </ButtonLoader>
      </Link>,
    );
  }
  
  // const breadcrumbs: ReactNode[] = [
  //   <Link
  //     href={jukiAppRoutes.JUDGE().contests.list()}
  //     className="link"
  //     key="contest.name"
  //   >
  //     <T className="tt-se">contests</T>
  //   </Link>,
  //   <Link
  //     href={jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab: ContestTab.OVERVIEW, subTab: problemIndex })}
  //     className="link"
  //     key="contest.name"
  //   >
  //     <div className="ws-np">{contest.name}</div>
  //   </Link>,
  // ];
  // if (contestTab === ContestTab.PROBLEMS && problemArrayIndex !== -1) {
  //   breadcrumbs.push(
  //     <Link
  //       href={jukiAppRoutes.JUDGE().contests.view({
  //         key: contestKey,
  //         tab: ContestTab.PROBLEMS,
  //       })}
  //       className="link"
  //     >
  //       <T className="tt-se">problems</T>
  //     </Link>,
  //   );
  //   breadcrumbs.push(<div>{problemIndex}</div>);
  // } else {
  //   breadcrumbs.push(renderReactNodeOrFunctionP1(tabHeaders[contestTab]?.header, { selectedTabKey: contestTab }));
  // }
  
  return (
    <TwoContentLayout
      // breadcrumbs={breadcrumbs}
      tabs={tabHeaders}
      tabButtons={extraNodes}
      selectedTabKey={contestTab}
      getHrefOnTabChange={tab => jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab, subTab: problemIndex })}
    >
      {/*<CustomHead title={contest.name} />*/}
      <div className="jk-row nowrap gap extend left">
        {/*{viewPortSize !== 'sm' && (*/}
        {/*  <>*/}
        {/*    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests">*/}
        {/*      <T className="tt-se">contests</T>*/}
        {/*    </LinkLastPath>*/}
        {/*    /*/}
        {/*  </>*/}
        {/*)}*/}
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
