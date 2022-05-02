import { ProblemCodeEditor, ProblemStatement, SplitPane } from 'components';
import { useRouter } from 'next/router';
import { ContestResponseDTO } from 'types';

export const ContestProblem = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { query } = useRouter();
  const problem = contest?.problems?.[query.index as string];
  
  return (
    <SplitPane
      minSize={80}
      className="contest-problem-split-pane"
    >
      <ProblemStatement problem={problem} contestIndex={query?.index as string} />
      <ProblemCodeEditor
        contest={{
          isAdmin: contest.isAdmin,
          isJudge: contest.isJudge,
          isContestant: contest.isContestant,
          problemIndex: query?.index as string,
        }}
        problem={problem}
      />
    </SplitPane>
  );
};
