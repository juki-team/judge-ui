import { Popover, T } from 'components';
import { PROBLEM_VERDICT, SUBMISSION_RUN_STATUS } from 'config/constants';
import { ProblemVerdict, SubmissionRunStatus } from 'types';

export const hasTimeHasMemory = (verdict: ProblemVerdict) => {
  return !(verdict === ProblemVerdict.CE || verdict === ProblemVerdict.HIDDEN || verdict === ProblemVerdict.NONE || verdict === ProblemVerdict.PENDING);
};

export const Time = ({ verdict, timeUsed }: { verdict: ProblemVerdict, timeUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{(timeUsed / 1000).toFixed(3)}&nbsp;<T className="cr-g3">s</T></> : <>-</>;
};

export const Memory = ({ verdict, memoryUsed }: { verdict: ProblemVerdict, memoryUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{memoryUsed}&nbsp;<T className="cr-g3">KB</T></> : <>-</>;
};

export const Verdict = ({
  verdict,
  points,
  status,
}: { verdict: ProblemVerdict, points?: number, status?: SubmissionRunStatus }) => {
  
  const verdictLabel = PROBLEM_VERDICT[verdict]?.label ? <T className="ws-np">{PROBLEM_VERDICT[verdict]?.label}</T> : verdict;
  const content = (
    <div className="jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
      {verdict}
      {verdict === ProblemVerdict.PA && points && <>({+points.toFixed(3)})</>}
    </div>
  );
  
  return (
    <Popover
      content={
        <div className="tt-se ws-np">
          {verdict === ProblemVerdict.PENDING ? (
            SUBMISSION_RUN_STATUS[status]?.label ?
              <T className="ws-np">{SUBMISSION_RUN_STATUS[status]?.label}</T> : status || verdictLabel
          ) : verdictLabel}
        </div>
      }
      triggerOn="hover"
      placement="top"
      showPopperArrow
    >
      {content}
    </Popover>
  );
};
