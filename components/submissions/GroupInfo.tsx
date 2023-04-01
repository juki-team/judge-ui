import { ProblemMode } from '@juki-team/commons';
import { Collapse, T, UpIcon_ } from 'components/index';
import { classNames } from 'helpers';
import React from 'react';
import { ProblemVerdict, TestCaseResultType } from 'types';
import { Memory, Time, Verdict } from './index';

export interface GroupInfoProps {
  groupKey: number,
  problemMode: ProblemMode,
  timeUsed: number,
  memoryUsed: number,
  verdict: ProblemVerdict,
  points: number,
  testCases: TestCaseResultType[],
  submitId: string,
}

export const GroupInfo = ({
  groupKey,
  problemMode,
  timeUsed,
  memoryUsed,
  verdict,
  points,
  testCases,
  submitId,
}: GroupInfoProps) => {
  return (
    <Collapse
      header={({ isOpen, toggle }) => (
        <div className={classNames('jk-row extend block gap jk-table-inline-row jk-pad-md group-info', { 'fw-br': isOpen })}>
          <div className="jk-row">
            {+groupKey ? (
                problemMode === ProblemMode.SUBTASK
                  ? <><T className="tt-se">subtask</T>{groupKey}</>
                  : problemMode === ProblemMode.PARTIAL
                    ? <><T className="tt-se">group</T>{groupKey}</>
                    : <T className="tt-se">test cases</T>) :
              <T className="tt-se">sample test cases</T>}
          </div>
          <div className="jk-row center gap">
            <Verdict verdict={verdict} points={points} submitId={submitId} />
            {!!testCases.length && <UpIcon_ onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />}
          </div>
          {(problemMode === ProblemMode.SUBTASK || problemMode === ProblemMode.PARTIAL) &&
              <div className="jk-row">{points}</div>}
          <div className="jk-row center gap"><Time timeUsed={timeUsed} verdict={verdict} /></div>
          <div className="jk-row center gap"><Memory verdict={verdict} memoryUsed={memoryUsed} /></div>
        </div>
      )}
      className="jk-row extend"
    >
      <div className={classNames('jk-row extend group-info-details')}>
        <div className={classNames('jk-row extend block gap jk-table-inline-row fw-bd')}>
          <div className="jk-row"><T>#</T></div>
          <div className="jk-row center gap"><T className="tt-se">verdict</T></div>
          {problemMode === ProblemMode.PARTIAL && <div className="jk-row center gap"><T className="tt-se">points</T></div>}
          <div className="jk-row center gap"><T className="tt-se">time</T></div>
          <div className="jk-row center gap"><T className="tt-se">memory</T></div>
          <div className="jk-row center gap"><T className="tt-se">exit code</T></div>
        </div>
        {testCases.map((testCase, index) => (
          <div className="jk-row extend block gap jk-table-inline-row" key={index}>
            <div className="jk-row">{index + 1}</div>
            <div className="jk-row"><Verdict verdict={testCase.verdict} submitId={submitId} /></div>
            {problemMode === ProblemMode.PARTIAL && <div className="jk-row">{testCase.points}</div>}
            <div className="jk-row center gap"><Time verdict={testCase.verdict} timeUsed={testCase.timeUsed} /></div>
            <div className="jk-row center gap"><Memory verdict={testCase.verdict} memoryUsed={testCase.memoryUsed} /></div>
            <div className={classNames('jk-row center gap', { 'cr-er fw-bd': testCase?.exitCode !== 0 })}>
              {testCase.exitCode}
            </div>
          </div>
        ))}
      </div>
    </Collapse>
  );
};
