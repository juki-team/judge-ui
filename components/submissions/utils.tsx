import { LoadingIcon, T, Tooltip } from 'components';
import { PROBLEM_VERDICT, SUBMISSION_RUN_STATUS } from 'config/constants';
import { useTask } from 'hooks';
import { ReactNode } from 'react';
import { ProblemVerdict, SocketEventSubmissionResponseDTO, SubmissionRunStatus } from 'types';

export const hasTimeHasMemory = (verdict: ProblemVerdict) => {
  return !(verdict === ProblemVerdict.CE
    || verdict === ProblemVerdict.HIDDEN
    || verdict === ProblemVerdict.NONE
    || verdict === ProblemVerdict.PENDING);
};

export const Time = ({ verdict, timeUsed }: { verdict: ProblemVerdict, timeUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{(timeUsed / 1000).toFixed(3)}&nbsp;<T className="cr-g3">s</T></> : <>-</>;
};

export const Memory = ({ verdict, memoryUsed }: { verdict: ProblemVerdict, memoryUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{memoryUsed}&nbsp;<T className="cr-g3">KB</T></> : <>-</>;
};

export interface VerdictProps {
  verdict: ProblemVerdict,
  points?: number,
  status?: SubmissionRunStatus,
  submitId: string,
  submissionData?: SocketEventSubmissionResponseDTO,
}

export const Verdict = ({ verdict, points, status, submitId, submissionData }: VerdictProps) => {
  
  const verdictLabel = (verdict: ProblemVerdict) => PROBLEM_VERDICT[verdict]?.label
    ? <T className="tt-se ws-np">{PROBLEM_VERDICT[verdict]?.label}</T>
    : verdict;
  
  const SubmissionLabel: { [key in SubmissionRunStatus]: (props: SocketEventSubmissionResponseDTO) => ReactNode } = {
    [SubmissionRunStatus.NONE]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        {verdictLabel(verdict)}
      </div>
    ),
    [SubmissionRunStatus.FAILED]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        {verdictLabel(verdict)}
      </div>
    ),
    [SubmissionRunStatus.RECEIVED]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.RECEIVED].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.COMPILING]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.COMPILING].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.COMPILED]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.COMPILED].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.COMPILATION_ERROR]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        {verdictLabel(verdict)}
      </div>
    ),
    [SubmissionRunStatus.FETCHING_TEST_CASES]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.FETCHING_TEST_CASES].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.EXECUTED_TEST_CASE]: ({ testInfo, verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        {!!testInfo && (
          <div className="jk-row tx-t nowrap" style={{ lineHeight: 1, padding: '4px 0' }}>
            {testInfo.sampleCase
              ? <T className="tt-se">running sample cases</T>
              : <T className="tt-se">running test cases</T>}&nbsp;
            <span className="ws-np">{testInfo.caseResultsExecuted}/{testInfo.caseResultsTotal}</span>
          </div>
        )}
      </div>
    ),
    [SubmissionRunStatus.FAILED_TEST_CASE]: ({ testInfo, verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        {!!testInfo && (
          <div className="jk-row tx-t nowrap" style={{ lineHeight: 1, padding: '4px 0' }}>
            {testInfo.sampleCase
              ? <T className="tt-se">failed sample case</T>
              : <T className="tt-se">failed test case</T>}
          </div>
        )}
      </div>
    ),
    [SubmissionRunStatus.RUNNING_TEST_CASE]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.RUNNING_TEST_CASE].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.RUNNING_SAMPLE_TEST_CASES]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.RUNNING_SAMPLE_TEST_CASES].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.RUNNING_TEST_CASES]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.RUNNING_TEST_CASES].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.JUDGING_TEST_CASE]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.JUDGING_TEST_CASE].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.GRADING]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        <LoadingIcon size="small" />
        &nbsp;
        <div className="jk-row tx-t" style={{ lineHeight: 1, padding: '4px 0' }}>
          <T className="tt-se">{SUBMISSION_RUN_STATUS[SubmissionRunStatus.GRADING].label}</T>
        </div>
      </div>
    ),
    [SubmissionRunStatus.COMPLETED]: ({ verdict }) => (
      <div className="jk-row nowrap jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        {verdict === ProblemVerdict.PENDING ? <>
          <LoadingIcon size="small" />&nbsp;{verdictLabel(verdict)}</> : verdictLabel(verdict)}
        {verdict === ProblemVerdict.PA && points && <>&nbsp;({(+points || 0).toFixed(2)})</>}
      </div>
    ),
  };
  
  const content = (
    submissionData ?
      <>
        {SubmissionLabel[submissionData.status]?.(submissionData) || submissionData.status}
      </> : (
        <div className="jk-row center jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
          {verdict === ProblemVerdict.PENDING
            ? <><LoadingIcon size="small" />&nbsp;{verdictLabel(verdict)}</> : verdictLabel(verdict)}
          {verdict === ProblemVerdict.PA && points && <>&nbsp;
            <span className="ws-np">({(+points || 0).toFixed(2)})</span></>}
        </div>
      )
  );
  
  return (
    <Tooltip
      content={
        <div className="tt-se ws-np">
          {verdict === ProblemVerdict.PENDING ? (
            (status && SUBMISSION_RUN_STATUS[status]?.label)
              ? <T className="ws-np">{SUBMISSION_RUN_STATUS[status]?.label}</T> : status || verdictLabel(verdict)
          ) : verdictLabel(verdict)}
        </div>
      }
      placement="top"
    >
      {content}
    </Tooltip>
  );
};

export const ListenerVerdict = ({ verdict, points, status, submitId }: Omit<VerdictProps, 'submissionData'>) => {
  const { submissions } = useTask();
  
  const submissionData = submissions[submitId];
  
  return (
    <Verdict
      verdict={verdict}
      points={points}
      status={status}
      submitId={submitId}
      submissionData={submissionData}
    />
  );
};
