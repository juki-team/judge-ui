import { ButtonLoader, FetcherLayer, Popover, T, Tabs, Timer, TwoContentLayout, ViewOverview, ViewProblems } from 'components/index';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useContestRouter, useJukiBase } from 'hooks';
import { useRouter } from 'next/router';
import { ContentResponseType, ContestResponseDTO, ContestTab, Status } from 'types';
import { isEndlessContest } from '../../../helpers';
import Custom404 from '../../../pages/404';
import { ViewClarifications } from './ViewClarifications';
import { ViewMembers } from './ViewMembers';
import { ViewProblem } from './ViewProblem';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView() {
  
  const { push } = useRouter();
  const { lastProblemVisited, pushTab, contestKey, problemIndex, contestTab } = useContestRouter();
  const { viewPortSize } = useJukiBase();
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      options={{ refreshInterval: 60000 }}
      errorView={<Custom404 />}
    >
      {({ data: { content: contest } }) => {
        const { user: { isAdmin, isJudge, isContestant } = { isAdmin: false, isJudge: false, isContestant: false } } = contest || {};
        const isEndless = isEndlessContest(contest);
        let statusLabel = '';
        let tag = '';
        let timeInterval = 0;
        if (contest.isPast) {
          tag = 'success';
          statusLabel = 'past';
          timeInterval = new Date().getTime() - contest.settings.endTimestamp;
        } else if (contest.isFuture) {
          tag = 'info';
          statusLabel = 'upcoming';
          timeInterval = contest.settings.startTimestamp - new Date().getTime();
        } else if (contest.isLive) {
          tag = 'error';
          statusLabel = 'live';
          timeInterval = contest.settings.endTimestamp - new Date().getTime();
        }
        const literal = isEndless ? <T className="ws-np">endless</T> : (
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
        const allLiteralLabel = <div className={`jk-row center extend nowrap jk-tag ${tag}`}><T>{statusLabel}</T>,&nbsp;{literal}</div>;
        
        const tabHeaders = [
          {
            key: ContestTab.OVERVIEW,
            header: <T className="tt-ce">overview</T>,
            body: <ViewOverview contest={contest} />,
          },
        ];
        if (isAdmin || isJudge || contest.isLive || contest.isPast) {
          tabHeaders.push({
              key: lastProblemVisited ? ContestTab.PROBLEM : ContestTab.PROBLEMS,
              header: (
                <div className="jk-row gap">
                  {lastProblemVisited
                    ? <T className="tt-ce">problem</T>
                    : <T className="tt-ce">problems</T>} {lastProblemVisited}
                </div>
              ),
              body: problemIndex
                ? <ViewProblem contest={contest} />
                : <ViewProblems contest={contest} />,
            },
            {
              key: ContestTab.SCOREBOARD,
              header: <T className="tt-ce">scoreboard</T>,
              body: <ViewScoreboard contest={contest} />,
            },
          );
        }
        if (isAdmin || isJudge || ((contest.isLive || contest.isPast) && isContestant)) {
          tabHeaders.push({
            key: ContestTab.MY_SUBMISSIONS,
            header: <T className="tt-ce">my submissions</T>,
            body: <ViewProblemSubmissions contest={contest} mySubmissions />,
          });
        }
        if (isAdmin || isJudge || contest.isLive || contest.isPast) {
          tabHeaders.push({
            key: ContestTab.SUBMISSIONS,
            header: <T className="tt-ce">submissions</T>,
            body: <ViewProblemSubmissions contest={contest} />,
          });
        }
        if (contest.settings.clarifications) {
          tabHeaders.push({
            key: ContestTab.CLARIFICATIONS,
            header: <T className="tt-ce">clarifications</T>,
            body: <ViewClarifications contest={contest} />,
          });
        }
        
        if (isAdmin || isJudge) {
          tabHeaders.push({
            key: ContestTab.MEMBERS,
            header: <T className="tt-ce">members</T>,
            body: <ViewMembers contest={contest} />,
          });
        }
        
        const actionsSection = [];
        if (viewPortSize === 'lg' || viewPortSize === 'hg') {
          actionsSection.push(
            <div className={`jk-row jk-tag ${tag}`}>
              <T>{statusLabel}</T>,&nbsp;{literal}
            </div>,
          );
        }
        
        if (isAdmin) {
          actionsSection.push(
            <ButtonLoader
              size="small"
              onClick={async setLoaderStatus => {
                setLoaderStatus(Status.LOADING);
                await push(ROUTES.CONTESTS.EDIT(contestKey));
                setLoaderStatus(Status.SUCCESS);
              }}
            >
              <T>edit</T>
            </ButtonLoader>,
          );
        }
        
        return (
          <TwoContentLayout>
            <div className="content-title jk-col relative">
              <div className="jk-row nowrap gap extend">
                {/*<div className="jk-row cr-py back-link">*/}
                {/*  <Link href={ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS)}>*/}
                {/*    <a className="jk-row nowrap fw-bd link">*/}
                {/*      <ArrowIcon rotate={-90} />*/}
                {/*      <div className="screen lg hg"><T className="tt-se">contests</T></div>*/}
                {/*    </a>*/}
                {/*  </Link>*/}
                {/*</div>*/}
                <div className="jk-row center gap flex-1">
                  <h3>{contest.name}</h3>
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
            <Tabs
              selectedTabKey={contestTab as ContestTab}
              tabs={tabHeaders}
              onChange={tabKey => pushTab(tabKey as ContestTab)}
              actionsSection={actionsSection}
            />
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
}
