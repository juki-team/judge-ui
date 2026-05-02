import { PROBLEM_VERDICT } from '@juki-team/commons/constants';
import { ProblemVerdict } from '@juki-team/commons/enums';

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
