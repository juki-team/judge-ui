import { ProblemCodeEditor, ProblemStatement, SplitPane } from 'components';
import { useRouter } from 'next/router';

export const ContestProblem = ({ contest }: { contest: any }) => {
  
  const { query } = useRouter();
  
  const problem = contest?.problems?.[query.index as string];

  console.log(contest)
  
  return (
    <SplitPane
      minSize={80}
      // onlyFirstPane={!testCases}
      // closablePane={testCases ? { align: 'right', pane: 'second' } : undefined}
      className="contest-problem-split-pane"
    >
      <ProblemStatement problem={problem} contestIndex={query?.index as string} />
      <ProblemCodeEditor isRegistered={contest?.registered} problem={problem} contestIndex={query?.index as string} />
    </SplitPane>
  );
};
