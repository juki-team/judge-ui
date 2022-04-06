import { Button, CheckIcon, CloseIcon, LinkIcon, T, TimerClock } from 'components';
import { useRouter } from 'next/router';
import { ContestSettingsParams, ContestTab, Judge, Period } from 'types';
import { ROUTES } from '../../config/constants';

export const ContestProblems = ({ contest }: { contest: any }) => {
  
  const { problems = {}, settings, registered, timing, key } = contest;
  const now = new Date().getTime();
  
  const { push, query: { key: contestKey, index, tab, ...query } } = useRouter();
  
  return (
    <div className="jk-row gap jk-pad">
      {(Object.values(problems) as any[]).map(problem => {
        const canSubmit = (registered && settings.start <= now && now < settings.start + timing.duration) && (
          (!settings[ContestSettingsParams.LIMIT_PROBLEM_TIME]) ||
          (settings[ContestSettingsParams.LIMIT_PROBLEM_TIME] && (now < settings.start + problem.start + problem.duration))
        );
        return (
          <div key={problem.index} className="jk-shadow problem-card jk-col jk-border-radius"
               style={{ borderTop: `8px solid ${problem.color}` }}>
            <div className="problem-status jk-row space-between">
              <div
                className={'text-bold problem-index bg-color-gray-6' + (problem.myPoints !== -1 ? (problem.myPoints === problem.points ? ' accepted' : ' wrong') : '')}
              >
                {problem.myPoints !== -1 && (
                  problem.myPoints === problem.points ? <CheckIcon /> : <CloseIcon />
                )}
                {problem.index}
              </div>
              <div className="problem-id text-xs text-semi-bold color-gray-3">ID: {problem.id}</div>
            </div>
            <div className="text-m text-bold jk-row"> {problem.name} </div>
            <div className="">
              {settings[ContestSettingsParams.LIMIT_PROBLEM_TIME] && (
                <div className="problem-timing jk-row">
                  {!canSubmit ? (<div className="closed jk-row text-s bold"><T>closed</T></div>) : (
                    <TimerClock
                      startDate={new Date(settings.start + problem.start)}
                      endDate={new Date(settings.start + problem.start + problem.duration)}
                      labels={{
                        [Period.LIVE]: 'close on',
                        [Period.PAST]: 'closed ago',
                        [Period.CALC]: '...',
                        [Period.FUTURE]: 'open on',
                      }}
                      onFinish={() => console.log('reload contest!!', key)}
                    />
                  )}
                </div>
              )}
              <div className="problem-info-data jk-row">
                <div className="problem-score jk-col">
                  <div className="problem-score-points text-s text-bold">{problem.points}</div>
                  <div className="problem-score-label text-t text-semi-bold"><T>score</T></div>
                </div>
                {/*<div className="divider"> |</div>*/}
                {/*<div className="problem-success child-center">*/}
                {/*  <div className="problem-success-points">{(problem.successRate * 100).toFixed(1)} %</div>*/}
                {/*  <div className="problem-success-label">{t('success rate')}</div>*/}
                {/*</div>*/}
              </div>
            </div>
            <div className="buttons-actions jk-row">
              {problem.judge === Judge.JUKI_JUDGE ? (
                <Button onClick={() => push({
                  pathname: ROUTES.CONTESTS.VIEW(key, ContestTab.PROBLEMS, problem.index),
                  query,
                }, undefined, { shallow: true })}>
                  <T>{((problem.myPoints !== -1 && problem.myPoints === problem.points) || (
                    !canSubmit
                  )) ? 'view problem' : 'solve problem'}</T>
                </Button>
              ) : (
                <a href={problem.link} target="_blank" rel="noopener noreferrer">
                  <Button icon={<LinkIcon />}>
                    <T>{problem.myPoints !== -1 && problem.myPoints === problem.points ? 'view problem' : 'solve problem'}</T>
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
