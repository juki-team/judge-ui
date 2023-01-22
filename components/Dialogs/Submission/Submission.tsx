import { CodeViewer, Collapse, DateLiteral, FetcherLayer, Memory, Modal, T, Time, UpIcon_, Verdict } from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE, QueryParam } from 'config/constants';
import { removeParamQuery } from 'helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { ContentResponseType, ProblemMode, ProblemVerdict, SubmitResponseDTO, TestCaseResultType } from 'types';
import Custom404 from '../../../pages/404';
import { hasTimeHasMemory } from '../../submissions';
import { GroupInfo } from './GroupInfo';

export const SubmissionModal = ({ submitId }: { submitId: string }) => {
  
  const { push, query } = useRouter();
  const handleClose = () => push({ query: removeParamQuery(query, QueryParam.SUBMISSION_VIEW, null) });
  
  return (
    <Modal isOpen={true} onClose={handleClose} closeIcon closeWhenClickOutside>
      <section className="jk-pad-md">
        <FetcherLayer<ContentResponseType<SubmitResponseDTO>>
          url={JUDGE_API_V1.SUBMIT.SUBMIT_ID(submitId)}
          // onError={() => {
          //   addErrorNotification(somethingWentWrongMessage());
          //   setOpen(false);
          // }}
          errorView={() => {
            return (
              <div><Custom404 /></div>
            );
          }}
        >
          {({ data }: { data: ContentResponseType<SubmitResponseDTO> }) => {
            const {
              problemMode,
              language,
              sourceCode,
              memoryUsed,
              timeUsed,
              verdict,
              points,
              status,
              timestamp,
              testCaseResults,
              verdictByGroups,
              canViewSourceCode,
              compilationResult,
            } = data.content;
            const date = new Date(timestamp);
            const testCasesByGroup: { [key: number]: TestCaseResultType[] } = {};
            (testCaseResults || []).forEach((testCase) => {
              const group = testCase.group ? (problemMode === ProblemMode.SUBTASK ? testCase.group : 1) : 0;
              if (testCasesByGroup[group]) {
                testCasesByGroup[group].push(testCase);
              } else {
                testCasesByGroup[group] = [testCase];
              }
            });
            
            return (
              <>
                {((verdictByGroups && !!Object.keys(verdictByGroups).length) || (testCasesByGroup && !!Object.keys(testCasesByGroup).length)) && (
                  <div>
                    <h3>
                      <T>
                        {problemMode === ProblemMode.SUBTASK
                          ? 'information by subtasks'
                          : problemMode === ProblemMode.PARTIAL
                            ? 'information by groups'
                            : 'sample and test case information'}
                      </T>
                    </h3>
                    <div className="jk-col gap">
                      <div className="jk-row extend block gap jk-table-inline-header">
                        <div className="jk-row"><T>{problemMode === ProblemMode.SUBTASK ? 'groups' : ''}</T></div>
                        <div className="jk-row"><T>verdict</T></div>
                        {(problemMode === ProblemMode.SUBTASK || problemMode === ProblemMode.PARTIAL) &&
                          <div className="jk-row"><T>points</T></div>}
                        <div className="jk-row"><T>time</T></div>
                        <div className="jk-row"><T>memory</T></div>
                      </div>
                    </div>
                    {(verdictByGroups && !!Object.keys(verdictByGroups).length) ? (
                      <div className="jk-col jk-border-radius-inline">
                        {Object.entries(verdictByGroups).map(([groupKey, result]) => (
                          <GroupInfo
                            key={groupKey}
                            groupKey={+groupKey}
                            problemMode={problemMode}
                            memoryUsed={result.memoryUsed}
                            verdict={result.verdict}
                            timeUsed={result.timeUsed}
                            points={result.points}
                            testCases={testCasesByGroup[result.group] || []}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="jk-col jk-border-radius-inline">
                        {Object.entries(testCasesByGroup).map(([groupKey, result]) => (
                          <GroupInfo
                            key={groupKey}
                            groupKey={+groupKey}
                            problemMode={problemMode}
                            memoryUsed={0}
                            verdict={ProblemVerdict.PENDING}
                            timeUsed={0}
                            points={problemMode === ProblemMode.PARTIAL ? +result.reduce((sum, testCase) => sum + testCase.points, 0)
                              .toFixed(3) : 0}
                            testCases={result}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!!canViewSourceCode && (
                  <div className="jk-col gap stretch">
                    <h3><T>source code</T></h3>
                    <Collapse
                      header={({ isOpen, toggle }) => (
                        <div className="jk-row">
                          <div>{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
                          <div className="jk-row gap center">
                            <Verdict verdict={verdict} points={points} status={status} />
                            {verdict !== ProblemVerdict.NONE
                              && verdict !== ProblemVerdict.PENDING
                              && compilationResult?.success === false
                              && <UpIcon_ onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />}
                          </div>
                          {hasTimeHasMemory(verdict) && <div><Time timeUsed={timeUsed} verdict={verdict} /></div>}
                          {hasTimeHasMemory(verdict) && <div><Memory memoryUsed={memoryUsed} verdict={verdict} /></div>}
                          <DateLiteral date={date} twoLines={false} />
                        </div>
                      )}
                    >
                      <div className="submission-stderr-content jk-text-stderr">
                        {compilationResult?.err}
                      </div>
                    </Collapse>
                    <div className="submission-info-code-source">
                      <CodeViewer code={sourceCode} language={language} lineNumbers withCopyButton withLanguageLabel />
                    </div>
                  </div>
                )}
              </>
            );
          }}
        </FetcherLayer>
      </section>
    </Modal>
  );
};
