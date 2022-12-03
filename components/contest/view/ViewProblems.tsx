import { Button, ButtonLoader, CheckIcon, CloseIcon, ExternalIcon, LinkIcon, T, TimerLabeled } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, getProblemJudgeKey, getProblemUrl } from 'helpers';
import { useNotification } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ContentResponseType, ContestResponseDTO, ContestTab, HTTPMethod, Judge, Period, ProblemTab, Status, SubmissionRunStatus } from 'types';

export const ViewProblems = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { problems = {}, user, isLive, key, settings } = contest;
  const { isContestant, isJudge, isAdmin } = user || {};
  const { push, query: { key: contestKey, index, tab, ...query } } = useRouter();
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const isJudgeOrAdmin = isJudge || isAdmin;
  
  return (
    <div className="jk-row gap jk-pad-md">
      {Object.values(problems).map(problem => {
        const canSubmit = isContestant && isLive && problem.startTimestamp <= Date.now() && Date.now() <= problem.endTimestamp;
        return (
          <div
            key={problem.index}
            className="jk-shadow problem-card jk-col jk-border-radius"
            style={{ borderTop: `8px solid ${problem.color}` }}
          >
            <div className="problem-status jk-row space-between">
              <div
                className={'fw-br problem-index bc-g6 jk-border-radius-inline' + (problem.myAttempts ? (problem.mySuccess ? ' accepted' : ' wrong') : '')}
              >
                {!!problem.myAttempts && (problem.mySuccess ? <CheckIcon size="small" /> : <CloseIcon size="small" />)}
                {problem.index}
              </div>
              {problem.judge === Judge.JUKI_JUDGE ? (
                (isJudgeOrAdmin ? (
                  <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT), query }} target="_blank">
                    <div className="problem-id tx-xs fw-bd cr-g3 jk-row">ID: {problem.key}&nbsp;<ExternalIcon size="tiny" /></div>
                  </Link>
                ) : (<div className="problem-id tx-xs fw-bd cr-g3">ID: {problem.key}</div>))
              ) : (
                <div className="problem-id tx-xs fw-bd cr-g3">
                  {getProblemJudgeKey(problem.judge, problem.key)}
                </div>
              )}
            </div>
            <div className="tx-m fw-br jk-row"> {problem.name} </div>
            <div className="jk-col gap">
              {isContestant && isLive && (problem.startTimestamp !== contest.settings.startTimestamp || problem.endTimestamp !== contest.settings.endTimestamp) && (
                <div className="problem-timing jk-row">
                  <TimerLabeled
                    startDate={new Date(problem.startTimestamp)}
                    endDate={new Date(problem.endTimestamp)}
                    labels={{
                      [Period.LIVE_END]: 'close on',
                      [Period.LIVE_START]: 'close on',
                      [Period.PAST]: 'closed ago',
                      [Period.CALC]: '...',
                      [Period.FUTURE]: 'open on',
                      [Period.TIME_OUT]: 'time out',
                    }}
                    laps={2}
                    // onFinish={() => console.log('reload contest!!', key)}
                  />
                </div>
              )}
              <div className="jk-row gap">
                <div className="jk-col">
                  <div className="tx-s fw-br">{problem.points}</div>
                  <div className="tx-t fw-bd"><T>score</T></div>
                </div>
                <div className="jk-divider horizontal" />
                <div className="jk-col">
                  <div className="tx-s fw-br">
                    {problem.totalAttempts ? (problem.totalSuccess / problem.totalAttempts * 100).toFixed(1) + ' %' : '-'}
                  </div>
                  <div className="tx-t fw-bd"><T>success rate</T></div>
                </div>
              </div>
            </div>
            <div className="buttons-actions jk-row gap">
              {problem.judge === Judge.JUKI_JUDGE ? (
                <Button
                  onClick={() => push({
                    pathname: ROUTES.CONTESTS.VIEW(key, ContestTab.PROBLEM, problem.index),
                    query,
                  }, undefined, { shallow: true })}
                >
                  <T>{(problem.mySuccess || !canSubmit) ? 'view problem' : 'solve problem'}</T>
                </Button>
              ) : (
                <a href={getProblemUrl(problem.judge, problem.key)} target="_blank" rel="noopener noreferrer">
                  <Button icon={<LinkIcon />}>
                    <T>{(problem.mySuccess || !canSubmit) ? 'view problem' : 'solve problem'}</T>
                  </Button>
                </a>
              )}
              {isJudgeOrAdmin && (
                <ButtonLoader
                  onClick={async (setLoaderStatus, loaderStatus, event) => {
                    setLoaderStatus(Status.LOADING);
                    const result = cleanRequest<ContentResponseType<{ listCount: number, status: SubmissionRunStatus.RECEIVED }>>(
                      await authorizedRequest(JUDGE_API_V1.REJUDGE.CONTEST_PROBLEM(key, getProblemJudgeKey(problem.judge, problem.key)), {
                        method: HTTPMethod.POST,
                      }));
                    if (result.success) {
                      addSuccessNotification(<div><T>rejudging</T>&nbsp;{result.content.listCount}&nbsp;<T>submissions</T></div>);
                      setLoaderStatus(Status.SUCCESS);
                    } else {
                      addErrorNotification(<T
                        className="tt-se">{result.message || 'something went wrong, please try again later'}</T>);
                      setLoaderStatus(Status.ERROR);
                    }
                  }}
                  size="tiny"
                >
                  <T>rejudge problem</T>
                </ButtonLoader>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
