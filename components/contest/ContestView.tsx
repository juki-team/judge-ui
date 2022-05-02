import {
  ArrowIcon,
  ContestOverview,
  ContestProblems,
  FetcherLayer,
  NotFound,
  Popover,
  T,
  Tabs,
  Timer,
  TwoContentLayout,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useContestRouter, useFetcher } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { ContentResponseType, ContestResponseDTO, ContestTab } from 'types';
import { ContestProblem } from './ContestProblem';
import { ContestProblemSubmissions } from './ContestProblemSubmissions';
import { ContestScoreboard } from './ContestScoreboard';

export function ContestView() {
  
  const { push, locale } = useRouter();
  const { lastProblemVisited, pushTab, contestKey, problemIndex, contestTab } = useContestRouter();
  const { session } = useUserState();
  const {
    isLoading,
    data,
  } = useFetcher<ContentResponseType<ContestResponseDTO>>(JUDGE_API_V1.CONTEST.CONTEST_V1(contestKey as string, session), { refreshInterval: 60000 });
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      isLoading={isLoading}
      data={data}
      error={!data?.success ? <NotFound redirectAction={() => push(ROUTES.CONTESTS.LIST())} /> : null}
    >
      {({ content: contest }) => {
        let statusLabel = '';
        let tag = '';
        let timeInterval = 0;
        if (contest.isPast) {
          tag = 'success';
          statusLabel = 'past';
          timeInterval = new Date().getTime() - contest.endTimestamp;
        } else if (contest.isFuture) {
          tag = 'info';
          statusLabel = 'upcoming';
          timeInterval = contest.startTimestamp - new Date().getTime();
        } else if (contest.isLive) {
          tag = 'error';
          statusLabel = 'live';
          timeInterval = contest.endTimestamp - new Date().getTime();
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
            body: <ContestOverview contest={contest} />,
          },
        ];
        if (contest.isAdmin || contest.isJudge || contest.isLive || contest.isPast) {
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
                ? <ContestProblem contest={contest} />
                : <ContestProblems contest={contest} />,
            },
            {
              key: ContestTab.SCOREBOARD,
              header: <T className="text-capitalize">scoreboard</T>,
              body: <ContestScoreboard contest={contest} />,
            },
          );
        }
        if (contest.isAdmin || contest.isJudge || ((contest.isLive || contest.isPast) && contest.isContestant)) {
          tabHeaders.push({
            key: ContestTab.MY_SUBMISSIONS,
            header: <T className="text-capitalize">my submissions</T>,
            body: <ContestProblemSubmissions contest={contest} mySubmissions />,
          });
        }
        if (contest.isAdmin || contest.isJudge || contest.isLive || contest.isPast) {
          tabHeaders.push({
            key: ContestTab.SUBMISSIONS,
            header: <T className="text-capitalize">submissions</T>,
            body: <ContestProblemSubmissions contest={contest} />,
          });
        }
        if (contest.clarifications) {
          tabHeaders.push({
            key: ContestTab.CLARIFICATIONS,
            header: <T className="text-capitalize">clarifications</T>,
            body: <div></div>,
          });
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
              actionsSection={[
                <div className={`jk-row screen lg hg jk-tag ${tag}`}>
                  <T>{statusLabel}</T>,&nbsp;{literal}
                </div>,
              ]}
              //  <ButtonLoader
              // onClick={async setLoaderStatus => {
              //   setLoaderStatus(Status.LOADING);
              //   await push(ROUTES.CONTESTS.EDIT('' + query.key, ContestTab.OVERVIEW));
              //       setLoaderStatus(Status.SUCCESS);
              //     }}
              //   >
              //     <T>edit</T>
              //   </ButtonLoader>
            />
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
}