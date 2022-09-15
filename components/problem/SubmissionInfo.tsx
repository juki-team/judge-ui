import { CodeViewer, Collapse, DateLiteral, FetcherLayer, Field, Modal, T, UpIcon } from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames } from 'helpers';
import { useNotification } from 'hooks';
import React, { useState } from 'react';
import { useUserState } from 'store';
import {
  ContentResponseType,
  ProblemMode,
  ProblemVerdict,
  ProgrammingLanguage,
  ReactNodeOrFunctionType,
  SubmissionRunStatus,
  SubmitResponseDTO,
  TestCaseResultType,
} from 'types';
import { SOMETHING_WENT_WRONG_MESSAGE } from '../commons/Messages';
import { hasTimeHasMemory, Memory, Time, Verdict } from './utils';

export interface SubmissionInfoProps {
  submitId: string,
  language: ProgrammingLanguage,
  timeUsed: number,
  memoryUsed: number,
  verdict: ProblemVerdict,
  points: number,
  date: Date,
  children: ReactNodeOrFunctionType,
  problem: {
    mode: ProblemMode,
    timeLimit: number,
    memoryLimit: number,
  },
  contest?: {
    key: string,
    problemIndex: string,
    name: string,
  },
  canViewSourceCode: boolean,
  status: SubmissionRunStatus,
}

interface GroupInfoProps {
  groupKey: number,
  isSubtaskProblem: boolean,
  timeUsed: number,
  memoryUsed: number,
  verdict: ProblemVerdict,
  points: number,
  testCases: TestCaseResultType[],
}

const GroupInfo = ({ groupKey, isSubtaskProblem, timeUsed, memoryUsed, verdict, points, testCases }: GroupInfoProps) => {
  return (
    <Collapse
      header={({ isOpen, toggle }) => (
        <div className={classNames('jk-row extend block gap jk-table-inline-row jk-pad group-info', { 'tx-wd-bolder': isOpen })}>
          <div className="jk-row">
            {+groupKey ? (isSubtaskProblem ? <><T className="text-sentence-case">subtask</T>{groupKey}</> :
                <T className="text-sentence-case">test cases</T>) :
              <T className="text-sentence-case">sample test cases</T>}
          </div>
          <div className="jk-row center gap">
            <Verdict verdict={verdict} points={points} />
            {!!testCases.length && <UpIcon onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />}
          </div>
          {isSubtaskProblem && <div className="jk-row">{points}</div>}
          <div className="jk-row center gap"><Time timeUsed={timeUsed} verdict={verdict} /></div>
          <div className="jk-row center gap"><Memory verdict={verdict} memoryUsed={memoryUsed} /></div>
        </div>
      )}
      className="jk-row extend"
    >
      <div className={classNames('jk-row extend group-info-details')}>
        <div className={classNames('jk-row extend block gap jk-table-inline-row text-semi-bold')}>
          <div className="jk-row"><T>#</T></div>
          <div className="jk-row center gap"><T className="text-sentence-case">verdict</T></div>
          <div className="jk-row center gap"><T className="text-sentence-case">time</T></div>
          <div className="jk-row center gap"><T className="text-sentence-case">memory</T></div>
          <div className="jk-row center gap"><T className="text-sentence-case">return code</T></div>
        </div>
        {testCases.map((testCase, index) => (
          <div className="jk-row extend block gap jk-table-inline-row" key={index}>
            <div className="jk-row">{index + 1}</div>
            <div className="jk-row"><Verdict verdict={testCase.verdict} /></div>
            <div className="jk-row center gap"><Time verdict={testCase.verdict} timeUsed={testCase.timeUsed} /></div>
            <div className="jk-row center gap"><Memory verdict={testCase.verdict} memoryUsed={testCase.memoryUsed} /></div>
            <div className={classNames('jk-row center gap', { 'color-error text-semi-bold': testCase?.exitCode !== 0 })}>
              {testCase.exitCode}
            </div>
          </div>
        ))}
      </div>
    </Collapse>
  );
};

export const SubmissionInfo = ({
  submitId,
  language,
  timeUsed,
  memoryUsed,
  verdict,
  points,
  date,
  children,
  contest,
  problem,
  canViewSourceCode,
  status,
}: SubmissionInfoProps) => {
  const isSubtaskProblem = problem.mode === ProblemMode.SUBTASK;
  const [open, setOpen] = useState(false);
  const { addErrorNotification } = useNotification();
  const { session } = useUserState();
  const canOpen = !open && canViewSourceCode;
  
  return (
    <Field
      className={classNames('jk-row', { link: canOpen })}
      onClick={() => canOpen && setOpen(true)}
    >
      <Modal isOpen={open} onClose={() => setOpen(false)} closeIcon>
        <section className="jk-pad">
          <FetcherLayer<ContentResponseType<SubmitResponseDTO>>
            url={(open && canViewSourceCode) ? JUDGE_API_V1.SUBMIT.SUBMIT_ID(submitId, session) : undefined}
            onError={() => {
              addErrorNotification(SOMETHING_WENT_WRONG_MESSAGE);
              setOpen(false);
            }}
          >
            {({ data }) => {
              const source = data?.content.sourceCode;
              const testCasesByGroup: { [key: number]: TestCaseResultType[] } = {};
              (data?.content?.testCaseResults || []).forEach((testCase) => {
                if (testCasesByGroup[testCase.group]) {
                  testCasesByGroup[testCase.group].push(testCase);
                } else {
                  testCasesByGroup[testCase.group] = [testCase];
                }
              });
              return (
                <>
                  {data.content.verdictByGroups && !!Object.keys(data.content.verdictByGroups).length && (
                    <div>
                      <h6><T>subtask info</T></h6>
                      <div className="jk-col gap">
                        <div className="jk-row extend block gap jk-table-inline-header">
                          <div className="jk-row"><T>{isSubtaskProblem ? 'groups' : ''}</T></div>
                          <div className="jk-row"><T>verdict</T></div>
                          {isSubtaskProblem && <div className="jk-row"><T>points</T></div>}
                          <div className="jk-row"><T>time</T></div>
                          <div className="jk-row"><T>memory</T></div>
                        </div>
                      </div>
                      <div className="jk-col jk-border-radius-inline">
                        {Object.entries(data.content.verdictByGroups).map(([groupKey, result]) => (
                          <GroupInfo
                            key={groupKey}
                            groupKey={+groupKey}
                            isSubtaskProblem={isSubtaskProblem}
                            memoryUsed={result.memoryUsed}
                            verdict={result.verdict}
                            timeUsed={result.timeUsed}
                            points={result.points}
                            testCases={testCasesByGroup[result.group] || []}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {!!data.content.canViewSourceCode && (
                    <div className="jk-col gap stretch">
                      <h6><T>source code</T></h6>
                      <Collapse
                        header={({ isOpen, toggle }) => (
                          <div className="jk-row">
                            <div>{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
                            <div className="jk-row gap center">
                              <Verdict verdict={verdict} points={points} status={status} />
                              {data.content?.verdict !== ProblemVerdict.NONE
                                && data.content?.verdict !== ProblemVerdict.PENDING
                                && data.content?.compilationResult?.success === false
                                && <UpIcon onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />}
                            </div>
                            {hasTimeHasMemory(verdict) && <div><Time timeUsed={timeUsed} verdict={verdict} /></div>}
                            {hasTimeHasMemory(verdict) && <div><Memory memoryUsed={memoryUsed} verdict={verdict} /></div>}
                            <DateLiteral date={date} twoLines={false} />
                          </div>
                        )}
                      >
                        <div className="submission-stderr-content text-stderr">
                          {data?.content?.compilationResult?.err}
                        </div>
                      </Collapse>
                      <div className="submission-info-code-source">
                        <CodeViewer code={source} language={language} lineNumbers withCopyButton withLanguageLabel />
                      </div>
                    </div>
                  )}
                </>
              );
            }}
          </FetcherLayer>
        </section>
      </Modal>
      {children}
    </Field>
  );
};