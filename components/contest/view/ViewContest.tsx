import {
  Breadcrumbs,
  ButtonLoader,
  EditIcon,
  FetcherLayer,
  LinkContests,
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
import { useContestRouter, useJukiBase, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Custom404 from 'pages/404';
import React from 'react';
import { ContentResponseType, ContestResponseDTO, ContestTab, LastLinkKey, Status } from 'types';
import { ViewClarifications } from './ViewClarifications';
import { ViewMembers } from './ViewMembers';
import { ViewProblem } from './ViewProblem';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView() {
  
  const { push } = useRouter();
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { lastProblemVisited, pushTab, contestKey, problemIndex, contestTab, query } = useContestRouter();
  const { viewPortSize } = useJukiBase();
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      options={{ refreshInterval: 60000 }}
      errorView={<Custom404 />}
    >
      {({ data: { content: contest } }) => {
        const {
          user: { isAdmin, isJudge, isContestant } = {
            isAdmin: false,
            isJudge: false,
            isContestant: false,
          },
        } = contest || {};
        let statusLabel = '';
        let tag = '';
        let timeInterval = 0;
        if (contest.isEndless) {
          tag = 'info-light';
          statusLabel = 'endless';
          timeInterval = -1;
        } else if (contest.isPast) {
          tag = 'gray-6';
          statusLabel = 'past';
          timeInterval = new Date().getTime() - contest.settings.endTimestamp;
        } else if (contest.isFuture) {
          tag = 'success-light';
          statusLabel = 'upcoming';
          timeInterval = contest.settings.startTimestamp - new Date().getTime();
        } else if (contest.isLive) {
          tag = 'error-light';
          statusLabel = 'live';
          timeInterval = contest.settings.endTimestamp - new Date().getTime();
        }
  
        const literal = contest.isEndless ? <T className="ws-np">endless</T> : (
          <>
            {contest.isLive
              ? <T className="ws-np">ends in</T>
              : contest.isPast
                ? <T className="ws-np">ends ago</T>
                : <T className="ws-np">stars in</T>}
            &nbsp;
            <div><Timer currentTimestamp={timeInterval} laps={2} interval={-1000} literal /></div>
          </>
        );
  
        const allLiteralLabel = <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
          <T>{statusLabel}</T>,&nbsp;{literal}</div>;
        
        const tabHeaders = {
          [ContestTab.OVERVIEW]: {
            key: ContestTab.OVERVIEW,
            header: <T className="tt-ce ws-np">overview</T>,
            body: <ViewOverview contest={contest} />,
          },
        };
        if (isAdmin || isJudge || contest.isLive || contest.isPast) {
          tabHeaders[lastProblemVisited ? ContestTab.PROBLEM : ContestTab.PROBLEMS] = {
            key: lastProblemVisited ? ContestTab.PROBLEM : ContestTab.PROBLEMS,
            header: (
              <div className="jk-row gap nowrap">
                {lastProblemVisited
                  ? <T className="tt-ce ws-np">problem</T>
                  : <T className="tt-ce ws-np">problems</T>} {lastProblemVisited}
              </div>
            ),
            body: problemIndex
              ? <ViewProblem contest={contest} />
              : <ViewProblems contest={contest} />,
          };
          tabHeaders[ContestTab.SCOREBOARD] = {
            key: ContestTab.SCOREBOARD,
            header: <T className="tt-ce ws-np">scoreboard</T>,
            body: <div className="pad-left-right pad-bottom"><ViewScoreboard contest={contest} /></div>,
          };
        }
        if (isAdmin || isJudge || ((contest.isLive || contest.isPast) && isContestant)) {
          tabHeaders[ContestTab.MY_SUBMISSIONS] = {
            key: ContestTab.MY_SUBMISSIONS,
            header: <T className="tt-ce ws-np">my submissions</T>,
            body: <ViewProblemMySubmissions contest={contest} />,
          };
        }
        if (isAdmin || isJudge || contest.isLive || contest.isPast) {
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
              <T>{statusLabel}</T>,&nbsp;{literal}
            </div>,
          );
        }
        
        if (isAdmin) {
          extraNodes.push(
            <ButtonLoader
              size={viewPortSize !== 'sm' ? 'small' : 'large'}
              onClick={async setLoaderStatus => {
                setLoaderStatus(Status.LOADING);
                await push(ROUTES.CONTESTS.EDIT(contestKey));
                setLoaderStatus(Status.SUCCESS);
              }}
              icon={<EditIcon />}
            >
              {viewPortSize !== 'sm' && <T>edit</T>}
            </ButtonLoader>,
          );
        }
        
        const breadcrumbs = [
          <Link href="/" className="link"><T className="tt-se">home</T></Link>,
          <LinkContests><T className="tt-se">contests</T></LinkContests>,
          <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.OVERVIEW), query }} className="link">
            <div className="ws-np">{contest.name}</div>
          </Link>,
        ];
        if (contestTab === ContestTab.PROBLEM) {
          breadcrumbs.push(
            <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contest.key, ContestTab.PROBLEMS), query }} className="link">
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
              <div className="jk-col relative pad-left-right">
                <div className="jk-row nowrap gap extend">
                  <div className="jk-row left gap flex-1">
                    <h2 style={{ padding: 'var(--pad-sm) 0' }}>{contest.name}</h2>
                    <Popover
                      content={literal}
                      triggerOn="hover"
                      placement="bottom"
                      popoverContentClassName={`color-white bg-color-${tag} jk-row nowrap`}
                    >
                      <div className={`jk-tag tt-ue tx-s ${tag} screen md`}><T>{statusLabel}</T></div>
                    </Popover>
                  </div>
                </div>
                <div className="screen sm jk-row extend">{allLiteralLabel}</div>
              </div>
              <div className="pad-left-right">
                <TabsInline tabs={tabHeaders} tabSelected={contestTab} pushTab={pushTab} extraNodes={extraNodes} />
              </div>
            </div>
            {tabHeaders[contestTab as ContestTab]?.body}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
}
