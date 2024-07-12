import {
  CodeViewer,
  Collapse,
  DateLiteral,
  FetcherLayer,
  GroupInfo,
  hasTimeHasMemory,
  JukiSurprisedImage,
  ListenerVerdict,
  Memory,
  T,
  Time,
  Timer,
  UpIcon,
} from 'components';
import { JUDGE_API_V1, PROGRAMMING_LANGUAGE } from 'config/constants';
import {
  ContentResponseType,
  ProblemScoringMode,
  ProblemVerdict,
  SubmissionDataResponseDTO,
  TestCaseResultType,
} from 'types';

const SubmitViewLayout = ({ submit }: { submit: SubmissionDataResponseDTO }) => {
  
  const {
    submitId,
    isProblemEditor,
    problemScoringMode,
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
    judgmentTime,
  } = submit;
  
  const date = new Date(timestamp);
  const testCasesByGroup: { [key: number]: TestCaseResultType[] } = {};
  (
    testCaseResults || []
  ).forEach((testCase) => {
    const group = testCase.group ? (
      problemScoringMode === ProblemScoringMode.SUBTASK ? testCase.group : 1
    ) : 0;
    if (testCasesByGroup[group]) {
      testCasesByGroup[group].push(testCase);
    } else {
      testCasesByGroup[group] = [ testCase ];
    }
  });
  
  return (
    <div>
      <Collapse
        header={({ isOpen, toggle }) => (
          <div className="jk-row-col gap">
            <div className="jk-col">
              <div>{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
              <T className="fw-bd tt-se">language</T>
            </div>
            <div className="jk-col">
              <div className="jk-row gap center">
                <ListenerVerdict verdict={verdict} points={points} status={status} submitId={submitId} />
                {verdict !== ProblemVerdict.NONE
                  && verdict !== ProblemVerdict.PENDING
                  && compilationResult?.success === false
                  && <UpIcon onClick={toggle} rotate={isOpen ? 0 : 180} className="link" />}
              </div>
              <T className="fw-bd tt-se">verdict</T>
            </div>
            {hasTimeHasMemory(verdict) && (
              <div className="jk-col">
                <div><Time timeUsed={timeUsed} verdict={verdict} /></div>
                <T className="fw-bd tt-se">time used</T>
              </div>
            )}
            {hasTimeHasMemory(verdict) && (
              <div className="jk-col">
                <div><Memory memoryUsed={memoryUsed} verdict={verdict} /></div>
                <T className="fw-bd tt-se">memory used</T>
              </div>
            )}
            <div className="jk-col">
              <DateLiteral date={date} />
              <T className="fw-bd tt-se">date</T>
            </div>
            {isProblemEditor && (
              <div className="jk-col">
                <div className="jk-row">
                  ~&nbsp;
                  {judgmentTime > 0
                    ? <Timer currentTimestamp={judgmentTime} interval={0} literal laps={1} />
                    : (
                      <>
                        <Timer currentTimestamp={Date.now() - -judgmentTime} interval={1000} literal laps={1} />
                      </>
                    )}
                </div>
                <T className="fw-bd tt-se">{judgmentTime > 0 ? 'judgment time' : 'judging'}</T>
              </div>
            )}
          </div>
        )}
      >
        <div className="submission-stderr-content jk-text-stderr">
          {compilationResult?.err}
        </div>
      </Collapse>
      {(
        (verdictByGroups && !!Object.keys(verdictByGroups).length)
        || (testCasesByGroup && !!Object.keys(testCasesByGroup).length)
      ) && (
        <div>
          <h3>
            <T>
              {problemScoringMode === ProblemScoringMode.SUBTASK
                ? 'information by subtasks'
                : problemScoringMode === ProblemScoringMode.PARTIAL
                  ? 'information by groups'
                  : 'sample and test case information'}
            </T>
          </h3>
          <div className="jk-col gap">
            <div className="jk-row extend block gap jk-table-inline-header">
              <div className="jk-row"><T>{problemScoringMode === ProblemScoringMode.SUBTASK ? 'groups' : ''}</T></div>
              <div className="jk-row" style={{ flex: 3 }}><T>verdict</T></div>
              {(problemScoringMode === ProblemScoringMode.SUBTASK || problemScoringMode === ProblemScoringMode.PARTIAL) && (
                <div className="jk-row"><T>points</T></div>
              )}
              <div className="jk-row"><T>time</T></div>
              <div className="jk-row"><T>memory</T></div>
            </div>
          </div>
          {(
            verdictByGroups && !!Object.keys(verdictByGroups).length
          ) ? (
            <div className="jk-col jk-border-radius-inline">
              {Object.entries(verdictByGroups).map(([ groupKey, result ]) => (
                <GroupInfo
                  key={groupKey}
                  groupKey={+groupKey}
                  isProblemEditor={isProblemEditor}
                  problemScoringMode={problemScoringMode}
                  memoryUsed={result.memoryUsed}
                  verdict={result.verdict}
                  timeUsed={result.timeUsed}
                  points={result.points}
                  testCases={testCasesByGroup[result.group] || []}
                  submitId={submitId}
                />
              ))}
            </div>
          ) : (
            <div className="jk-col jk-border-radius-inline">
              {Object.entries(testCasesByGroup).map(([ groupKey, result ]) => (
                <GroupInfo
                  key={groupKey}
                  groupKey={+groupKey}
                  isProblemEditor={isProblemEditor}
                  problemScoringMode={problemScoringMode}
                  memoryUsed={0}
                  verdict={ProblemVerdict.PENDING}
                  timeUsed={0}
                  points={problemScoringMode === ProblemScoringMode.PARTIAL
                    ? +result.reduce((sum, testCase) => sum + testCase.points, 0).toFixed(3)
                    : 0}
                  testCases={result}
                  submitId={submitId}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {!!canViewSourceCode && (
        <div className="jk-col gap stretch">
          <h3><T>source code</T></h3>
          <div className="submission-info-code-source">
            <CodeViewer code={sourceCode} language={language} lineNumbers withCopyButton withLanguageLabel />
          </div>
        </div>
      )}
    </div>
  );
};

export const SubmitView = ({ submitId, triggerFetch }: { submitId: string, triggerFetch?: number }) => (
  <FetcherLayer<ContentResponseType<SubmissionDataResponseDTO>>
    url={JUDGE_API_V1.SUBMIT.SUBMIT_ID(submitId)}
    errorView={() => {
      return (
        <div className="jk-col extend jk-pg-md">
          <div className="jk-col gap center">
            <div className="image-404"><JukiSurprisedImage /></div>
            <h3><T className="tt-ue">submission not found</T></h3>
            <p>
              <T className="tt-se">the submission does not exist or you do not have permissions to view it</T>
            </p>
          </div>
        </div>
      );
    }}
    triggerFetch={triggerFetch}
  >
    {({ data, mutate }) => <SubmitViewLayout submit={data.content} />}
  </FetcherLayer>
);
