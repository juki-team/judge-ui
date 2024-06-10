import {
  Breadcrumbs,
  ButtonLoader,
  contestStateMap,
  CopyIcon,
  CupIcon,
  CustomHead,
  EditIcon,
  EditViewMembers,
  FetcherLayer,
  HomeLink,
  LinkLastPath,
  LoadingIcon,
  NavigateBeforeIcon,
  NavigateNextIcon,
  T,
  TabsInline,
  Tooltip,
  TwoContentSection,
  ViewOverview,
  ViewProblemMySubmissions,
  ViewProblems,
} from 'components';
import { JUDGE_API_V1, LS_INITIAL_CONTEST_KEY, ROUTES } from 'config/constants';
import { parseContest, renderReactNodeOrFunctionP1 } from 'helpers';
import { useContestRouter, useJukiRouter, useJukiUI, useJukiUser, useT, useTrackLastPath } from 'hooks';
import React, { ReactNode } from 'react';
import {
  ContentResponseType,
  ContestResponseDTO,
  ContestTab,
  EditCreateContestType,
  LastPathKey,
  Status,
  TabsType,
} from 'types';
import Custom404 from '../../../pages/404';
import { getContestTimeLiteral } from '../commons';
import { ViewClarifications } from './ViewClarifications';
import { ViewDynamicScoreboard } from './ViewDynamicScoreboard';
import { ViewProblem } from './ViewProblem';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView() {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const { pushRoute, searchParams } = useJukiRouter();
  const { pushTab, contestKey, problemIndex, contestTab } = useContestRouter();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const { user: { canCreateContest } } = useJukiUser();
  const { t } = useT();
  
  const breadcrumbs = [
    <HomeLink key="home" />,
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
    <Link
      href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.OVERVIEW), query: searchParams.toString() }}
      className="link"
      key="contestKey"
    >
      <div className="ws-np">{contestKey}</div>
    </Link>,
  ];
  
  const breadcrumbsLoading = [
    ...breadcrumbs,
    <T className="tt-ce ws-np" key="overview">overview</T>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      options={{ refreshInterval: 60000 }}
      loadingView={
        <TwoContentSection>
          <div className="jk-col stretch extend nowrap">
            <Breadcrumbs breadcrumbs={breadcrumbsLoading} />
            <div className="jk-col pn-re jk-pg-rl">
              <div className="jk-row nowrap gap extend">
                <h2
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 'calc(100vw - var(--pad-md) - var(--pad-md))',
                  }}
                >
                  {contestKey}
                </h2>
              </div>
            </div>
            <div className="jk-pg-rl">
              <TabsInline
                tabs={{
                  [ContestTab.OVERVIEW]: {
                    key: ContestTab.OVERVIEW,
                    header: <T className="tt-ce ws-np">overview</T>,
                    body: '',
                  },
                  'loading': {
                    key: 'loading',
                    header: <div className="jk-row">
                      <div className="dot-flashing" />
                    </div>,
                    body: '',
                  },
                }}
                selectedTabKey={ContestTab.OVERVIEW}
                onChange={() => null}
              />
            </div>
          </div>
          <div className="jk-row jk-col extend">
            <LoadingIcon size="very-huge" className="cr-py" />
          </div>
        </TwoContentSection>
      }
      errorView={
        <TwoContentSection>
          <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <Custom404>
            <h3><T className="tt-ue">contest not found</T></h3>
            <p>
              <T className="tt-se">the contest does not exist or you do not have permissions to view it</T>
            </p>
            <LinkLastPath lastPathKey={LastPathKey.CONTESTS}>
              <div className="jk-row"><CupIcon /><T className="tt-se">go to contest list</T></div>
            </LinkLastPath>
          </Custom404>
        </TwoContentSection>
      }
    >
      {({ data: { content: contest }, mutate }) => {
        const {
          user: { isAdmin, isJudge, isContestant } = {
            isAdmin: false, isJudge: false, isContestant: false,
          },
        } = contest || {};
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
          tabHeaders[problemIndex ? ContestTab.PROBLEM : ContestTab.PROBLEMS] = {
            key: problemIndex ? ContestTab.PROBLEM : ContestTab.PROBLEMS,
            header: (
              <div className="jk-row gap nowrap">
                {problemIndex
                  ? <>
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
                  </>
                  : <T className="tt-ce ws-np">problems</T>}
              </div>
            ),
            body: problemIndex ? <ViewProblem contest={contest} /> : <ViewProblems contest={contest} />,
          };
          tabHeaders[ContestTab.SCOREBOARD] = {
            key: ContestTab.SCOREBOARD,
            header: <T className="tt-ce ws-np">scoreboard</T>,
            body: (
              <div className="jk-pg-rl jk-pg-tb">
                <ViewScoreboard contest={contest} mutate={mutate} />
              </div>
            ),
          };
        }
        
        if (isAdmin || isJudge || !contest.settings.scoreboardLocked) {
          tabHeaders[ContestTab.DYNAMIC_SCOREBOARD] = {
            key: ContestTab.DYNAMIC_SCOREBOARD,
            header: <T className="tt-ce ws-np">dynamic scoreboard</T>,
            body: (
              <div className="jk-pg-rl jk-pg-tb">
                <ViewDynamicScoreboard contest={contest} mutate={mutate} />
              </div>
            ),
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
              <div className="jk-pg-tb jk-pg-rl">
                <EditViewMembers
                  contest={contest as unknown as EditCreateContestType}
                  membersToView={contest.members}
                />
              </div>
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
          <HomeLink key="home" />,
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
          <TwoContentSection>
            <div>
              <CustomHead title={contest.name} />
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="jk-col pn-re jk-pg-rl">
                <div className="jk-row nowrap gap extend">
                  <h2
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100vw - var(--pad-md) - var(--pad-md))',
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
              <div className="jk-pg-rl">
                <TabsInline
                  tabs={tabHeaders}
                  selectedTabKey={contestTab}
                  onChange={pushTab}
                  extraNodes={extraNodes}
                  extraNodesPlacement={viewPortSize === 'sm' ? 'bottomRight' : undefined}
                />
              </div>
            </div>
            {renderReactNodeOrFunctionP1(tabHeaders[contestTab]?.body, { selectedTabKey: contestTab })}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
}
