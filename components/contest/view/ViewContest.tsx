import {
  Breadcrumbs,
  ButtonLoader,
  contestStateMap,
  CupIcon,
  EditIcon,
  FetcherLayer,
  LinkContests,
  LoadingIcon,
  NavigateBeforeIcon,
  NavigateNextIcon,
  Popover,
  T,
  TabsInline,
  TwoContentSection,
  ViewOverview,
  ViewProblemMySubmissions,
  ViewProblems,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useContestRouter, useJukiUI, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { ContentResponseType, ContestResponseDTO, ContestTab, LastLinkKey, Status, TabsType } from 'types';
import Custom404 from '../../../pages/404';
import { getContestTimeLiteral } from '../commons';
import { ViewClarifications } from './ViewClarifications';
import { ViewMembers } from './ViewMembers';
import { ViewProblem } from './ViewProblem';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView() {
  
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { push } = useRouter();
  const { pushTab, contestKey, problemIndex, contestTab, query } = useContestRouter();
  const { viewPortSize } = useJukiUI();
  
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <LinkContests><T className="tt-se">contests</T></LinkContests>,
    <Link
      href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.OVERVIEW), query }}
      className="link"
    >
      <div className="ws-np">{contestKey}</div>
    </Link>,
  ];
  
  const breadcrumbsLoading = [
    ...breadcrumbs,
    <T className="tt-ce ws-np">overview</T>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      options={{ refreshInterval: 60000 }}
      loadingView={
        <TwoContentSection>
          <div className="jk-col stretch extend nowrap">
            <Breadcrumbs breadcrumbs={breadcrumbsLoading} />
            <div className="jk-col pn-re pad-left-right">
              <div className="jk-row nowrap gap extend">
                <h2
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 'calc(100vw - var(--pad-border) - var(--pad-border))',
                  }}
                >
                  {contestKey}
                </h2>
              </div>
            </div>
            <div className="pad-left-right">
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
            <LinkContests>
              <div className="jk-row"><CupIcon /><T className="tt-se">go to contest list</T></div>
            </LinkContests>
          </Custom404>
        </TwoContentSection>
      }
    >
      {({ data: { content: contest } }) => {
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
                      onClick={async () => {
                        const previousProblemIndex = problems[(problemArrayIndex - 1 + problems.length) % problems.length]?.index;
                        await push({
                          pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, previousProblemIndex),
                          query,
                        });
                      }}
                    />
                    <T className="tt-ce ws-np">problem</T> {problemIndex}
                    <NavigateNextIcon
                      style={{ padding: 0 }}
                      className="clickable jk-br-ie"
                      onClick={async () => {
                        const nextProblemIndex = problems[(problemArrayIndex + 1) % problems.length]?.index;
                        await push({
                          pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, nextProblemIndex),
                          query,
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
            body: <div className="pad-left-right pad-bottom"><ViewScoreboard contest={contest} /></div>,
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
        
        if (isAdmin || isJudge) {
          tabHeaders[ContestTab.MEMBERS] = {
            key: ContestTab.MEMBERS,
            header: <T className="tt-ce">members</T>,
            body: <ViewMembers contest={contest} />,
          };
        }
        
        const extraNodes = [];
        if (viewPortSize === 'lg' || viewPortSize === 'hg') {
          extraNodes.push(
            <div className={`jk-row nowrap jk-tag ${tag}`}>
              {contest.isEndless
                ? <T className="ws-np">{statusLabel}</T>
                : <><T className="ws-np">{statusLabel}</T>,&nbsp;{literal}</>}
            </div>,
          );
        }
        
        if (isAdmin) {
          extraNodes.push(
            <ButtonLoader
              size="small"
              onClick={async setLoaderStatus => {
                setLoaderStatus(Status.LOADING);
                await push(ROUTES.CONTESTS.EDIT(contestKey));
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
          <Link href="/" className="link"><T className="tt-se">home</T></Link>,
          <LinkContests><T className="tt-se">contests</T></LinkContests>,
          <Link
            href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW), query }}
            className="link"
          >
            <div className="ws-np">{contest.name}</div>
          </Link>,
        ];
        if (contestTab === ContestTab.PROBLEM) {
          breadcrumbs.push(
            <Link
              href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.PROBLEMS), query }}
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
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="jk-col pn-re pad-left-right">
                <div className="jk-row nowrap gap extend">
                  <h2
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: 'calc(100vw - var(--pad-border) - var(--pad-border))',
                    }}
                  >
                    {contest.name}
                  </h2>
                  <Popover
                    content={literal}
                    triggerOn="hover"
                    placement="bottom"
                    popoverContentClassName={`color-white bg-color-${tag} jk-row nowrap`}
                  >
                    <div className={`jk-tag tt-ue tx-s ${tag} screen md`}><T className="ws-np">{statusLabel}</T></div>
                  </Popover>
                </div>
                <div className="screen sm jk-row extend">{allLiteralLabel}</div>
              </div>
              <div className="pad-left-right">
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
