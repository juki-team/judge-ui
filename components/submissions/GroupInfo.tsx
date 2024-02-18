import { VirtualItem } from '@tanstack/virtual-core';
import { Collapse, T, Tooltip, UpIcon, VirtualizedRowsFixed } from 'components';
import { classNames } from 'helpers';
import React, { useCallback } from 'react';
import { ProblemMode, ProblemVerdict, TestCaseResultType } from 'types';
import { useJukiUI } from '../../hooks';
import { Memory, Time, Verdict } from './index';

export interface GroupInfoProps {
  isProblemEditor: boolean,
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
                            isProblemEditor,
                          }: GroupInfoProps) => {
  const { viewPortSize } = useJukiUI();
  const isSmall = viewPortSize === 'sm';
  const rowHeight = isSmall ? 54 + 8 + 8 : 24 + 8 + 8;
  
  const testCasesString = JSON.stringify(testCases);
  
  const renderRow = useCallback((virtualItem: VirtualItem) => {
    const testCases = JSON.parse(testCasesString);
    const index = virtualItem.index;
    const testCase = testCases[index];
    return (
      <div
        className="jk-row extend block gap jk-table-inline-row"
        key={index}
        style={{ borderBottom: '1px solid var(--t-color-gray-5)' }}
      >
        {isProblemEditor ? (
          <Tooltip
            content={
              <div className="jk-row ws-np">
                {testCase.testCaseKey}
              </div>
            }
            placement="top"
          >
            <div className="jk-row" style={{ flex: 0.4 }}>
              {index + 1}
            </div>
          </Tooltip>
        ) : (
          <div className="jk-row" style={{ flex: 0.4 }}>
            {index + 1}
          </div>
        )}
        <div className="jk-row"><Verdict verdict={testCase.verdict} submitId={submitId} shortLabel /></div>
        {problemMode === ProblemMode.PARTIAL && <div className="jk-row">{testCase.points}</div>}
        <div className="jk-row center ws-np nowrap">
          <Time verdict={testCase.verdict} timeUsed={testCase.timeUsed} />
        </div>
        <div className="jk-row center ws-np nowrap">
          <Memory verdict={testCase.verdict} memoryUsed={testCase.memoryUsed} />
        </div>
        <div className={classNames('jk-row center gap', { 'cr-er fw-bd': testCase?.exitCode !== 0 })}>
          {testCase.exitCode}
        </div>
      </div>
    );
  }, [ isProblemEditor, problemMode, submitId, testCasesString ]);
  
  return (
    <Collapse
      header={({ isOpen, toggle }) => (
        <div
          className={classNames(
            'jk-row extend block gap jk-table-inline-row jk-pad-md group-info',
            { 'fw-br': isOpen },
          )}
        >
          <div className="jk-row left nowrap">
            {!!testCases.length && <><UpIcon onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />&nbsp;</>}
            {+groupKey ? (
                problemMode === ProblemMode.SUBTASK
                  ? <><T className="tt-se ws-np">subtask</T>&nbsp;{groupKey}</>
                  : problemMode === ProblemMode.PARTIAL
                    ? <><T className="tt-se ws-np">group</T>&nbsp;{groupKey}</>
                    : <T className="tt-se">test cases</T>) :
              <T className="tt-se">sample cases</T>}
          </div>
          <div className="jk-row center gap nowrap" style={{ flex: 4 }}>
            <Verdict verdict={verdict} points={points} submitId={submitId} />
          </div>
          {(problemMode === ProblemMode.SUBTASK || problemMode === ProblemMode.PARTIAL) && (
            <div className="jk-row">{+points.toFixed(4)}</div>
          )}
          <div className="jk-row center gap">
            <Time timeUsed={timeUsed} verdict={verdict} />
          </div>
          <div className="jk-row center gap">
            <Memory verdict={verdict} memoryUsed={memoryUsed} />
          </div>
        </div>
      )}
      className="jk-row extend"
    >
      <div className={classNames('jk-row extend group-info-details')}>
        <div className={classNames('jk-row extend block gap jk-table-inline-row fw-bd')}>
          <div className="jk-row" style={{ flex: 0.4 }}><T>#</T></div>
          <div className="jk-row center gap"><T className="tt-se">verdict</T></div>
          {problemMode === ProblemMode.PARTIAL && <div className="jk-row center gap"><T className="tt-se">points</T>
          </div>}
          <div className="jk-row center gap"><T className="tt-se">time</T></div>
          <div className="jk-row center gap"><T className="tt-se">memory</T></div>
          <div className="jk-row center gap"><T className="tt-se">exit code</T></div>
        </div>
        <div
          style={{
            width: '100%',
            ...(testCases.length > 3 ? {
              height: rowHeight * 3,
              boxShadow: 'inset 0 0 2px rgba(var(--t-color-black-rgb), 0.3), inset 0 1px 3px 1px rgba(var(--t-color-black-rgb), 0.15)',
            } : {}),
          }}
        >
          <VirtualizedRowsFixed
            size={testCases.length}
            rowHeight={rowHeight}
            renderRow={renderRow}
          />
        </div>
      </div>
    </Collapse>
  );
};
