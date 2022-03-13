import { Button, ButtonLoader, CheckIcon, CloseIcon, LinkIcon, ReloadIcon, T, TimerClock } from 'components';
import { useRouter } from 'next/router';
import { ContestSettingsParams, ContestTab, Judge, Period, ProblemTab, Status } from 'types';
import { ROUTES } from '../../config/constants';
import { useNotification } from '../index';

export const ContestProblems = ({ contest }: { contest: any }) => {
  
  const { problems, settings, registered, timing, canRejudge, canUpdate, canRegister, key } = contest;
  const now = new Date().getTime();
  
  const { query, push } = useRouter();
  const { addSuccessNotification, addErrorNotification, addInfoNotification } = useNotification();
  
  console.log({ problems });
  return (
    <div>
      {(Object.values(problems) as any[]).map(problem => {
        const canSubmit = (registered && settings.start <= now && now < settings.start + timing.duration) && (
          (!settings[ContestSettingsParams.LIMIT_PROBLEM_TIME]) ||
          (settings[ContestSettingsParams.LIMIT_PROBLEM_TIME] && (now < settings.start + problem.start + problem.duration))
        );
        return (
          <div key={problem.index}>
            <div className="problem-status child-center">
              <div
                className={'text-m bold problem-index' + (problem.myPoints !== -1 ? (problem.myPoints === problem.points ? ' accepted' : ' wrong') : '')}
              >
                {problem.myPoints !== -1 && (
                  problem.myPoints === problem.points ? <CheckIcon /> : <CloseIcon />
                )}
                {problem.index}
              </div>
              <div className="problem-id text-xs semi-bold">ID: {problem.id}</div>
            </div>
            
            
            <div className="text-m bold"> {problem.name} </div>
            
            
            <div className="problem-info">
              {settings[ContestSettingsParams.LIMIT_PROBLEM_TIME] && (
                <div className="problem-timing child-center">
                  {!canSubmit ? (<div className="closed child-center text-s bold"><T>closed</T></div>) : (
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
              <div className="problem-info-data child-center">
                <div className="problem-score child-center">
                  <div className="problem-score-points text-s bold">{problem.points}</div>
                  <div className="problem-score-label text-t semi-bold"><T>score</T></div>
                </div>
                {/*<div className="divider"> |</div>*/}
                {/*<div className="problem-success child-center">*/}
                {/*  <div className="problem-success-points">{(problem.successRate * 100).toFixed(1)} %</div>*/}
                {/*  <div className="problem-success-label">{t('success rate')}</div>*/}
                {/*</div>*/}
              </div>
            </div>
            
            
            <div className="buttons-actions">
              {problem.judge === Judge.JUKI_JUDGE ? (
                <Button onClick={() => {
                  push(ROUTES.CONTESTS.VIEW(key, ContestTab.PROBLEM, problem.index, ProblemTab.STATEMENT));
                }}>
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
              {canRejudge && (
                <ButtonLoader
                  onClick={async setLoader => {
                    setLoader(Status.LOADING);
                    // const result = await apiContestRejudgeProblem(key, problem.index);
                    const result = {} as any;
                    if (result.success === Status.SUCCESS) {
                      setLoader(Status.SUCCESS);
                      addInfoNotification(
                        <><T className="text-sentence-case">successfully</T> {result.total} <T>submissions rejudged</T></>,
                      );
                    } else {
                      setLoader(Status.ERROR);
                      addErrorNotification(result.message);
                    }
                  }}
                  icon={<ReloadIcon />}
                  block
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
