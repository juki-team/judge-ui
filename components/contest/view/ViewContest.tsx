import {
  Breadcrumbs,
  ButtonLoader,
  contestStateMap,
  CupIcon,
  EditIcon,
  FetcherLayer,
  LinkContests,
  LoadingIcon,
  Popover,
  T,
  TabsInline,
  Timer,
  TwoContentSection,
  ViewOverview,
  ViewProblemMySubmissions,
  ViewProblems,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useContestRouter, useJukiUI, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React from 'react';
import { ContentResponseType, ContestResponseDTO, ContestTab, LastLinkKey, Status } from 'types';
import Custom404 from '../../../pages/404';
import { ViewClarifications } from './ViewClarifications';
import { ViewMembers } from './ViewMembers';
import { ViewProblem } from './ViewProblem';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView() {
  
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { push } = useRouter();
  const { lastProblemVisited, pushTab, contestKey, problemIndex, contestTab, query } = useContestRouter();
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
            <Link href="/contests" className="link tt-ue">
              <div className="jk-row gap"><CupIcon /><T>go to contest list page</T></div>
            </Link>
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
        let timeInterval = 0;
        if (contest.isEndless) {
          timeInterval = -1;
        } else if (contest.isPast) {
          timeInterval = new Date().getTime() - contest.settings.endTimestamp;
        } else if (contest.isFuture) {
          timeInterval = contest.settings.startTimestamp - new Date().getTime();
        } else if (contest.isLive) {
          timeInterval = contest.settings.endTimestamp - new Date().getTime();
        }
        
        const literal = contest.isEndless ? <T className="ws-np">endless</T> : (
          <>
            {contest.isLive ? <T className="ws-np">ends in</T> : contest.isPast ?
              <T className="ws-np">ends ago</T> : <T className="ws-np">stars in</T>}
            &nbsp;
            <div><Timer currentTimestamp={timeInterval} laps={2} interval={-1000} literal /></div>
          </>
        );
        
        const allLiteralLabel = contest.isEndless
          ? <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
            <T>{statusLabel}</T></div>
          : <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
            <T>{statusLabel}</T>,&nbsp;{literal}</div>;
        
        const tabHeaders = {
          [ContestTab.OVERVIEW]: {
            key: ContestTab.OVERVIEW,
            header: <T className="tt-ce ws-np">overview</T>,
            body: <ViewOverview contest={contest} />,
          },
        };
        if (isAdmin || isJudge || contest.isLive || contest.isPast || contest.isEndless) {
          tabHeaders[lastProblemVisited ? ContestTab.PROBLEM : ContestTab.PROBLEMS] = {
            key: lastProblemVisited ? ContestTab.PROBLEM : ContestTab.PROBLEMS,
            header: (
              <div className="jk-row gap nowrap">
                {lastProblemVisited
                  ? <T className="tt-ce ws-np">problem</T>
                  : <T className="tt-ce ws-np">problems</T>} {lastProblemVisited}
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
        
        const breadcrumbs = [
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
          breadcrumbs.push(<div>{lastProblemVisited}</div>);
        } else {
          breadcrumbs.push(tabHeaders[contestTab as ContestTab]?.header);
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
            {tabHeaders[contestTab as ContestTab]?.body}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
}
