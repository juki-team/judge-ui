import { ProgrammingLanguage, ReactNodeOrFunctionType } from '@bit/juki-team.juki.base-ui';
import { Button, CodeViewer, CopyIcon, CopyToClipboard, DateLiteral, Field, LoaderLayer, Modal, T } from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'config/constants';
import { can, classNames } from 'helpers';
import { useFetcher } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ContestState, ProblemVerdict } from 'types';
import { hasTimeHasMemory, Memory, Time, Verdict } from './utils';

export const SubmissionInfo = ({
  submitId,
  language,
  timeUsed,
  memoryUsed,
  verdict,
  submitPoints,
  verdictByGroups,
  date,
  nickname,
  children,
  contest,
  isSubtaskProblem,
}: {
  submitId: string,
  language: ProgrammingLanguage,
  timeUsed: number,
  memoryUsed: number,
  verdict: ProblemVerdict,
  submitPoints: number,
  verdictByGroups: {},
  date: Date,
  nickname: string,
  children: ReactNodeOrFunctionType,
  contest?: ContestState,
  isSubtaskProblem: boolean,
}) => {
  
  const [open, setOpen] = useState(false);
  const user = useUserState();
  const canView = contest ? can.viewContestProblemSubmissionSourceCode(user, contest, nickname) : can.viewProblemSubmissionSourceCode(user, nickname);
  
  const {
    data,
    isLoading,
    error,
  } = useFetcher<ContentResponseType<{ source: string }>>((open && canView) ? (contest ? JUDGE_API_V1.CONTEST.VIEW_SOURCE_SUBMISSION(contest?.key, submitId) : JUDGE_API_V1.PROBLEM.SUBMISSION_CODE(submitId)) : undefined);
  
  useEffect(() => {
    if ((data?.success === false || error) && open) {
      setOpen(false);
    }
  }, [data, error, open]);
  
  const source = data?.success ? data?.content?.source : '';
  
  return (
    <Field
      className={classNames('jk-row', { link: canView })}
      onClick={() => !open && canView && setOpen(true)}
    >
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <section className="jk-pad">
          {verdictByGroups && !!Object.keys(verdictByGroups).length && (
            <div>
              <h6><T>subtask info</T></h6>
              <div className="jk-col gap filled">
                <div className="jk-row block gap jk-table-inline-header">
                  <div className="jk-row"><T>{isSubtaskProblem ? 'groups' : ''}</T></div>
                  <div className="jk-row"><T>verdict</T></div>
                  {isSubtaskProblem && <div className="jk-row"><T>points</T></div>}
                  <div className="jk-row"><T>time</T></div>
                  <div className="jk-row"><T>memory</T></div>
                </div>
              </div>
              <div className="jk-col filled jk-border-radius-inline">
                {Object.entries(verdictByGroups).map(([groupKey, result]) => {
                  const {
                    timeUsed,
                    memoryUsed,
                    verdict,
                    points,
                    submitPoints,
                  } = (result || {}) as { timeUsed: number, memoryUsed: number, verdict: ProblemVerdict, points: number, submitPoints: number };
                  return (
                    <div className="jk-row block gap jk-table-inline-row" key={groupKey}>
                      <div className="jk-row">
                        {+groupKey ? (isSubtaskProblem ? <><T>subtask</T>{groupKey}</> : <T>test cases</T>) :
                          <T>sample test cases</T>}
                      </div>
                      <div className="jk-row"><Verdict verdict={verdict} submitPoints={submitPoints} /></div>
                      {isSubtaskProblem && <div className="jk-row">{points}</div>}
                      <div className="jk-row center gap"><Time timeUsed={timeUsed} verdict={verdict} /></div>
                      <div className="jk-row center gap"><Memory verdict={verdict} memoryUsed={memoryUsed} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <LoaderLayer loading={isLoading}>
            <div className="jk-col gap filled">
              <div className="">
                <h6><T>source code</T></h6>
                <div className="jk-row">
                  <div>{PROGRAMMING_LANGUAGE[language]?.name || language}</div>
                  <div><Verdict verdict={verdict} submitPoints={submitPoints} /></div>
                  {hasTimeHasMemory(verdict) && <div><Time timeUsed={timeUsed} verdict={verdict} /></div>}
                  {hasTimeHasMemory(verdict) && <div><Memory memoryUsed={memoryUsed} verdict={verdict} /></div>}
                  <DateLiteral date={date} twoLines={false} />
                </div>
              </div>
              <div className="submission-info-code-source">
                <CopyToClipboard text={source}>
                  <Button icon={<CopyIcon />} type="text" className="float-top-right" />
                </CopyToClipboard>
                <CodeViewer code={source} language={language} lineNumbers />
              </div>
            </div>
          </LoaderLayer>
        </section>
      </Modal>
      {children}
    </Field>
  );
};