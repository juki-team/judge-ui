import { PROBLEM_VERDICT } from 'src/constants';
import { ProblemVerdict } from 'types';

export const Verdict = ({ verdict }: { verdict: ProblemVerdict }) => {
  return (
    <div
      data-tooltip-id="jk-tooltip"
      data-tooltip-content={PROBLEM_VERDICT[verdict].label}
      className="jk-row center jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict]?.color }}
    >
      {verdict}
    </div>
  );
};
