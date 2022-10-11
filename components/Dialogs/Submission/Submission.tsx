import { useRouter } from 'next/router';
import React from 'react';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE, QueryParam } from '../../../config/constants';
import { removeParamQuery } from '../../../helpers';
import Custom404 from '../../../pages/404';
import { ContentResponseType, ProblemMode, ProblemVerdict, SubmitResponseDTO, TestCaseResultType } from '../../../types';
import { CodeViewer, Collapse, DateLiteral, FetcherLayer, Modal, T, UpIcon } from '../../index';
import { hasTimeHasMemory, Memory, Time, Verdict } from '../../Submissions';
import { GroupInfo } from './GroupInfo';

export const SubmissionModal = ({ submitId }: { submitId: string }) => {
  
  const { push, query } = useRouter();
  const handleClose = () => push({ query: removeParamQuery(query, QueryParam.SUBMISSION_VIEW, null) });
  
  return (
    <Modal isOpen={true} onClose={handleClose} closeIcon shouldCloseOnOverlayClick>
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
              if (testCasesByGroup[testCase.group]) {
                testCasesByGroup[testCase.group].push(testCase);
              } else {
                testCasesByGroup[testCase.group] = [testCase];
              }
            });
            const isSubtaskProblem = problemMode === ProblemMode.SUBTASK;
            
            return (
              <>
                {verdictByGroups && !!Object.keys(verdictByGroups).length && (
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
                      {Object.entries(verdictByGroups).map(([groupKey, result]) => (
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
                {!!canViewSourceCode && (
                  <div className="jk-col gap stretch">
                    <h6><T>source code</T></h6>
                    <Collapse
                      header={({ isOpen, toggle }) => (
                        <div className="jk-row">
                          <div>{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
                          <div className="jk-row gap center">
                            <Verdict verdict={verdict} points={points} status={status} />
                            {verdict !== ProblemVerdict.NONE
                              && verdict !== ProblemVerdict.PENDING
                              && compilationResult?.success === false
                              && <UpIcon onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />}
                          </div>
                          {hasTimeHasMemory(verdict) && <div><Time timeUsed={timeUsed} verdict={verdict} /></div>}
                          {hasTimeHasMemory(verdict) && <div><Memory memoryUsed={memoryUsed} verdict={verdict} /></div>}
                          <DateLiteral date={date} twoLines={false} />
                        </div>
                      )}
                    >
                      <div className="submission-stderr-content text-stderr">
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

