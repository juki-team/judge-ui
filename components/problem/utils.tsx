import { PROBLEM_VERDICT } from '../../config/constants';
import { ProblemVerdict } from '../../types';
import { Popover, T } from '../index';

export const hasTimeHasMemory = (verdict: ProblemVerdict) => {
  return !(verdict === ProblemVerdict.CE || verdict === ProblemVerdict.HIDDEN || verdict === ProblemVerdict.NONE || verdict === ProblemVerdict.PENDING);
};

export const Time = ({ verdict, timeUsed }: { verdict: ProblemVerdict, timeUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{(timeUsed / 1000).toFixed(3)} <T className="color-gray-3">s</T></> : <>-</>;
};

export const Memory = ({ verdict, memoryUsed }: { verdict: ProblemVerdict, memoryUsed: number }) => {
  return hasTimeHasMemory(verdict) ? <>{memoryUsed} <T className="color-gray-3">kb</T></> : <>-</>;
};

export const Verdict = ({ verdict, submitPoints }: { verdict: ProblemVerdict, submitPoints: number }) => {
  return (
    <Popover
      content={<div className="text-sentence-case text-nowrap">{PROBLEM_VERDICT[verdict]?.print || verdict}</div>}
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
