import {
  ButtonLoader,
  contestStateMap,
  CopyIcon,
  CustomHead,
  EditIcon,
  EditViewMembers,
  LinkLastPath,
  NavigateBeforeIcon,
  NavigateNextIcon,
  ProblemView,
  SpectatorInformation,
  T,
  Tooltip,
  TwoContentLayout,
  ViewOverview,
  ViewProblemMySubmissions,
  ViewProblems,
} from 'components';
import { JUDGE_API_V1, LS_INITIAL_CONTEST_KEY, ROUTES } from 'config/constants';
import { parseContest, renderReactNodeOrFunctionP1 } from 'helpers';
import {
  useContestRouter,
  useJukiNotification,
  useJukiRouter,
  useJukiUI,
  useJukiUser,
  useT,
  useTask,
  useTrackLastPath,
} from 'hooks';
import React, { ReactNode } from 'react';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  ContestResponseDTO,
  ContestTab,
  EditCreateContestType,
  LastPathKey,
  Status,
  TabsType,
} from 'types';
import { authorizedRequest, cleanRequest, getProblemJudgeKey } from '../../../helpers';
import { HTTPMethod } from '../../../types';
import { FirstLoginWrapper } from '../../index';
import { getContestTimeLiteral } from '../commons';
import { ViewClarifications } from './ViewClarifications';
import { ViewDynamicScoreboard } from './ViewDynamicScoreboard';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView({ contest, mutate }: { contest: ContestResponseDTO, mutate: KeyedMutator<any> }) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const { pushRoute, searchParams } = useJukiRouter();
  const { pushTab, contestKey, problemIndex, contestTab } = useContestRouter();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const { user: { permissions: { canCreateContest } } } = useJukiUser();
  const { t } = useT();
  const { listenSubmission } = useTask();
  const { addWarningNotification, notifyResponse } = useJukiNotification();
  
  const {
    user: { isAdmin, isJudge, isContestant, isGuest, isSpectator },
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
      body: <ViewOverview contest={contest} />,
    },
  };
  
  if (isAdmin || isJudge || contest.isLive || contest.isPast || contest.isEndless) {
    const problems = Object.values(contest.problems);
    problems.sort((problemA, problemB) => problemA.index.localeCompare(problemB.index));
    const problemArrayIndex = problems.findIndex(problem => problem.index === problemIndex);
    if (problemArrayIndex !== -1) {
      const problem = problems[problemArrayIndex];
      const problemJudgeKey = getProblemJudgeKey(problem.judge, problem.key);
      tabHeaders[ContestTab.PROBLEM] = {
        key: ContestTab.PROBLEM,
        header: (
          <div className="jk-row gap nowrap">
            <NavigateBeforeIcon
              style={{ padding: 0 }}
              className="clickable jk-br-ie"
              onClick={async (event) => {
                event.stopPropagation();
                const previousProblemIndex = problems[(problemArrayIndex - 1 + problems.length) % problems.length]?.index;
                await pushRoute({
                  pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, previousProblemIndex),
                  searchParams,
                });
              }}
            />
            <T className="tt-ce ws-np">problem</T> {problemIndex}
            <NavigateNextIcon
              style={{ padding: 0 }}
              className="clickable jk-br-ie"
              onClick={async (event) => {
                event.stopPropagation();
                const nextProblemIndex = problems[(problemArrayIndex + 1) % problems.length]?.index;
                await pushRoute({
                  pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, nextProblemIndex),
                  searchParams,
                });
              }}
            />
          </div>
        ),
        body: (
          <ProblemView
            problem={problem}
            infoPlacement="name"
            codeEditorSourceStoreKey={contest.key + '/' + problemJudgeKey}
            codeEditorCenterButtons={({ sourceCode, language }) => {
              const validSubmit = (
                <ButtonLoader
                  type="secondary"
                  size="tiny"
                  disabled={sourceCode === ''}
                  onClick={async setLoaderStatus => {
                    setLoaderStatus(Status.LOADING);
                    const response = cleanRequest<ContentResponseType<any>>(
                      await authorizedRequest(
                        JUDGE_API_V1.CONTEST.SUBMIT(contest.key, problemJudgeKey),
                        { method: HTTPMethod.POST, body: JSON.stringify({ language, source: sourceCode }) },
                      ),
                    );
                    if (notifyResponse(response, setLoaderStatus)) {
                      listenSubmission(response.content.submitId, problem.judge, problem.key);
                      pushTab(ContestTab.MY_SUBMISSIONS);
                      // TODO fix the filter Url param
                      // await mutate(JUDGE_API_V1.SUBMISSIONS.CONTEST_NICKNAME(
                      //   contestKey,
                      //   nickname,
                      //   1,
                      //   +(myStatusPageSize || PAGE_SIZE_OPTIONS[0]),
                      //   '',
                      //   '',
                      // ));
                    }
                  }}
                >
                  {isAdmin || isJudge ? <T>submit as judge</T> : <T>submit</T>}
                </ButtonLoader>
              );
              if (isAdmin || isJudge || isContestant) {
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
                      pushTab(ContestTab.OVERVIEW);
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
        body: <ViewProblems contest={contest} />,
      };
    }
    tabHeaders[ContestTab.SCOREBOARD] = {
      key: ContestTab.SCOREBOARD,
      header: <T className="tt-ce ws-np">scoreboard</T>,
      body: <ViewScoreboard contest={contest} mutate={mutate} />,
    };
  }
  
  if (isAdmin || isJudge || !contest.settings.scoreboardLocked) {
    tabHeaders[ContestTab.DYNAMIC_SCOREBOARD] = {
      key: ContestTab.DYNAMIC_SCOREBOARD,
      header: <T className="tt-ce ws-np">dynamic scoreboard</T>,
      body: <ViewDynamicScoreboard contest={contest} mutate={mutate} />,
    };
  }
  
  if (isAdmin ||
    isJudge ||
    (
      (
        contest.isLive || contest.isPast || contest.isEndless
      ) && isContestant
    )) {
    tabHeaders[ContestTab.MY_SUBMISSIONS] = {
      key: ContestTab.MY_SUBMISSIONS,
      header: <T className="tt-ce ws-np">my submissions</T>,
      body: <ViewProblemMySubmissions contest={contest} />,
    };
  }
  
  if (isAdmin || isJudge || contest.isLive || contest.isPast || contest.isEndless) {
    tabHeaders[ContestTab.SUBMISSIONS] = {
      key: ContestTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: <ViewProblemSubmissions contest={contest} />,
    };
  }
  
  if (contest.settings.clarifications) {
    tabHeaders[ContestTab.CLARIFICATIONS] = {
      key: ContestTab.CLARIFICATIONS,
      header: <T className="tt-ce ws-np">clarifications</T>,
      body: <ViewClarifications contest={contest} />,
    };
  }
  
  if (isAdmin || isJudge || contest.isPast || contest.isEndless) {
    tabHeaders[ContestTab.MEMBERS] = {
      key: ContestTab.MEMBERS,
      header: <T className="tt-ce">members</T>,
      body: (
        <EditViewMembers
          contest={contest as unknown as EditCreateContestType}
          membersToView={contest.members}
        />
      ),
    };
  }
  
  const extraNodes = [];
  if (viewPortSize === 'hg') {
    extraNodes.push(
      <div className={`jk-row nowrap jk-tag ${tag}`}>
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
          const { key, name, ...parsedContest } = parseContest(contest);
          localStorage.setItem(LS_INITIAL_CONTEST_KEY, JSON.stringify({
            ...parsedContest,
            key: `${key}-${t('copy')}`,
            name: `${name} (${t('COPY')})`,
          }));
          await pushRoute(ROUTES.CONTESTS.CREATE());
          setLoaderStatus(Status.SUCCESS);
        }}
        icon={<CopyIcon />}
        responsiveMobile
        type="light"
      >
        <T className="ws-np">copy</T>
      </ButtonLoader>,
    );
  }
  
  if (isAdmin) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          await pushRoute(ROUTES.CONTESTS.EDIT(contestKey));
          setLoaderStatus(Status.SUCCESS);
        }}
        icon={<EditIcon />}
        responsiveMobile
      >
        <T>edit</T>
      </ButtonLoader>,
    );
  }
  
  const breadcrumbs: ReactNode[] = [
    <LinkLastPath
      lastPathKey={LastPathKey.CONTESTS}
      key="contests"
    >
      <T className="tt-se">contests</T>
    </LinkLastPath>,
    <Link
      href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW), query: searchParams.toString() }}
      className="link"
      key="contest.name"
    >
      <div className="ws-np">{contest.name}</div>
    </Link>,
  ];
  if (contestTab === ContestTab.PROBLEM) {
    breadcrumbs.push(
      <Link
        href={{
          pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.PROBLEMS),
          query: searchParams.toString(),
        }}
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
      getPathname={tab => ROUTES.CONTESTS.VIEW('' + contestKey, tab, problemIndex || undefined)}
      tabButtons={extraNodes}
    >
      <div>
        <CustomHead title={contest.name} />
        <div className="jk-col pn-re">
          <div className="jk-row nowrap gap extend">
            <h2
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                // width: 'calc(100vw - var(--pad-md) - var(--pad-md))',
              }}
            >
              {contest.name}
            </h2>
            <Tooltip
              content={literal}
              placement="bottom"
            >
              <div className={`jk-tag tt-ue tx-s ${tag} screen md lg`}>
                <T className="ws-np">{statusLabel}</T>
              </div>
            </Tooltip>
          </div>
          <div className="screen sm jk-row extend">{allLiteralLabel}</div>
        </div>
      </div>
    </TwoContentLayout>
  );
}
