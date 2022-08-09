import {
  ArrowIcon,
  ButtonLoader,
  FetcherLayer,
  Popover,
  T,
  Tabs,
  Timer,
  TwoContentLayout,
  ViewOverview,
  ViewProblems,
} from 'components/index';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useContestRouter } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { ContentResponseType, ContestResponseDTO, ContestTab, Status } from 'types';
import Custom404 from '../../../pages/404';
import { ViewClarifications } from './ViewClarifications';
import { ViewMembers } from './ViewMembers';
import { ViewProblem } from './ViewProblem';
import { ViewProblemSubmissions } from './ViewProblemSubmissions';
import { ViewScoreboard } from './ViewScoreboard';

export function ContestView() {
  
  const { push } = useRouter();
  const { lastProblemVisited, pushTab, contestKey, problemIndex, contestTab } = useContestRouter();
  const { session } = useUserState();
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey, session)}
      options={{ refreshInterval: 60000 }}
      errorView={<Custom404 />}
    >
      {({ data: { content: contest } }) => {
        const { user: { isAdmin, isJudge, isContestant } = { isAdmin: false, isJudge: false, isContestant: false } } = contest || {};
        
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
        const literal = (
          <>
            {contest.isLive
              ? <T className="text-nowrap">ends in</T>
              : contest.isPast
                ? <T className="text-nowrap">ends ago</T>
                : <T className="text-nowrap">stars in</T>}
            &nbsp;
            <Timer currentTimestamp={timeInterval} laps={2} interval={-1000} literal />
          </>
        );
        const allLiteralLabel = <div className={`jk-row nowrap jk-tag ${tag}`}><T>{statusLabel}</T>,&nbsp;{literal}</div>;
        
        const tabHeaders = [
          {
            key: ContestTab.OVERVIEW,
            header: <T className="text-capitalize">overview</T>,
            body: <ViewOverview contest={contest} />,
          },
        ];
        if (isAdmin || isJudge || contest.isLive || contest.isPast) {
          tabHeaders.push({
              key: lastProblemVisited ? ContestTab.PROBLEM : ContestTab.PROBLEMS,
              header: (
                <div className="jk-row gap">
                  {lastProblemVisited
                    ? <T className="text-capitalize">problem</T>
                    : <T className="text-capitalize">problems</T>} {lastProblemVisited}
                </div>
              ),
              body: problemIndex
                ? <ViewProblem contest={contest} />
                : <ViewProblems contest={contest} />,
            },
            {
              key: ContestTab.SCOREBOARD,
              header: <T className="text-capitalize">scoreboard</T>,
              body: <ViewScoreboard contest={contest} />,
            },
          );
        }
        if (isAdmin || isJudge || ((contest.isLive || contest.isPast) && isContestant)) {
          tabHeaders.push({
            key: ContestTab.MY_SUBMISSIONS,
            header: <T className="text-capitalize">my submissions</T>,
            body: <ViewProblemSubmissions contest={contest} mySubmissions />,
          });
        }
        if (isAdmin || isJudge || contest.isLive || contest.isPast) {
          tabHeaders.push({
            key: ContestTab.SUBMISSIONS,
            header: <T className="text-capitalize">submissions</T>,
            body: <ViewProblemSubmissions contest={contest} />,
          });
        }
        if (contest.settings.clarifications) {
          tabHeaders.push({
            key: ContestTab.CLARIFICATIONS,
            header: <T className="text-capitalize">clarifications</T>,
            body: <ViewClarifications contest={contest} />,
          });
        }
        
        if (isAdmin || isJudge) {
          tabHeaders.push({
            key: ContestTab.MEMBERS,
            header: <T className="text-capitalize">members</T>,
            body: <ViewMembers contest={contest} />,
          });
        }
        
        const actionsSection = [
          <div className={`jk-row screen lg hg jk-tag ${tag}`}>
            <T>{statusLabel}</T>,&nbsp;{literal}
          </div>,
        ];
        
        if (isAdmin) {
          actionsSection.push(
            <ButtonLoader
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
                <div className="jk-row color-primary back-link">
                  <Link href={ROUTES.CONTESTS.LIST()}>
                    <a className="jk-row nowrap text-semi-bold link">
                      <ArrowIcon rotate={-90} />
                      <div className="screen lg hg"><T className="text-sentence-case">contests</T></div>
                    </a>
                  </Link>
                </div>
                <div className="jk-row center gap flex-1">
                  <h3>{contest.name}</h3>
                  <Popover
                    content={literal}
                    triggerOn="hover"
                    placement="bottom"
                    popoverContentClassName={`color-white bg-color-${tag} jk-row nowrap`}
                  >
                    <div className={`jk-tag ${tag} screen md`}><T>{statusLabel}</T></div>
                  </Popover>
                </div>
              </div>
              <div className="screen sm">{allLiteralLabel}</div>
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