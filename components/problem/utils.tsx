import { Popover, T } from 'components';
import { PROBLEM_VERDICT, SUBMISSION_RUN_STATUS } from 'config/constants';
import { ProblemVerdict, SubmissionRunStatus } from 'types';

export const hasTimeHasMemory = (verdict: ProblemVerdict) => {
  return !(verdict === ProblemVerdict.CE || verdict === ProblemVerdict.HIDDEN || verdict === ProblemVerdict.NONE || verdict === ProblemVerdict.PENDING);
};

export const Time = ({ verdict, timeUsed }: { verdict: ProblemVerdict, timeUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{(timeUsed / 1000).toFixed(3)} <T className="color-gray-3">s</T></> : <>-</>;
};

export const Memory = ({ verdict, memoryUsed }: { verdict: ProblemVerdict, memoryUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{memoryUsed} <T className="color-gray-3">kb</T></> : <>-</>;
};

export const Verdict = ({
  verdict,
  submitPoints,
  status,
}: { verdict: ProblemVerdict, submitPoints: number, status: SubmissionRunStatus }) => {
  
  const verdictLabel = PROBLEM_VERDICT[verdict]?.print ? <T className="text-nowrap">{PROBLEM_VERDICT[verdict]?.print}</T> : verdict;
  
  return (
    <Popover
      content={
        <div className="text-sentence-case text-nowrap">
          {verdict === ProblemVerdict.PENDING ? (
            SUBMISSION_RUN_STATUS[status]?.print ?
              <T className="text-nowrap">{SUBMISSION_RUN_STATUS[status]?.print}</T> : status || verdictLabel
          ) : verdictLabel}
        </div>
      }
      triggerOn="hover"
      placement="top"
      showPopperArrow
    >
      <div className="jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}>
        {verdict}
        {verdict === ProblemVerdict.PA && <>({submitPoints})</>}
      </div>
    </Popover>
  );
};
