import { Button, CheckIcon, CloseIcon, LinkIcon, T, TimerLabeled } from 'components';
import { useRouter } from 'next/router';
import { ContestResponseDTO, ContestTab, Judge, Period } from 'types';
import { ROUTES } from '../../config/constants';

export const ContestProblems = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { problems = {}, isContestant, isLive, key } = contest;
  
  const { push, query: { key: contestKey, index, tab, ...query } } = useRouter();
  
  return (
    <div className="jk-row gap jk-pad">
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
                className={'text-bold problem-index bg-color-gray-6 jk-border-radius-inline' + (problem.attempts ? (problem.success ? ' accepted' : ' wrong') : '')}
              >
                {!!problem.attempts && (problem.success ? <CheckIcon size="small" /> : <CloseIcon size="small" />)}
                {problem.index}
              </div>
              <div className="problem-id text-xs text-semi-bold color-gray-3">ID: {problem.key}</div>
            </div>
            <div className="text-m text-bold jk-row"> {problem.name} </div>
            <div className="jk-col gap">
              {2 === 2 && (
                <div className="problem-timing jk-row">
                  {!canSubmit
                    ? <div className="closed jk-row text-s bold"><T>closed</T></div>
                    : (
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
                    )
                  }
                </div>
              )}
              <div className="jk-row gap">
                <div className="jk-col">
                  <div className="text-s text-bold">{problem.points}</div>
                  <div className="text-t text-semi-bold"><T>score</T></div>
                </div>
                <div className="jk-divider horizontal" />
                <div className="jk-col">
                  <div className="text-s text-bold">{(problem.successRate * 100).toFixed(1)} %</div>
                  <div className="text-t text-semi-bold"><T>success rate</T></div>
                </div>
              </div>
            </div>
            <div className="buttons-actions jk-row">
              {problem.judge === Judge.JUKI_JUDGE ? (
                <Button
                  onClick={() => push({
                    pathname: ROUTES.CONTESTS.VIEW(key, ContestTab.PROBLEM, problem.index),
                    query,
                  }, undefined, { shallow: true })}
                >
                  <T>{(problem.success || !canSubmit) ? 'view problem' : 'solve problem'}</T>
                </Button>
              ) : (
                <a href={problem.url} target="_blank" rel="noopener noreferrer">
                  <Button icon={<LinkIcon />}>
                    <T>{(problem.success || !canSubmit) ? 'view problem' : 'solve problem'}</T>
                  </Button>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
