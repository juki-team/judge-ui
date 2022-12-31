import { ProblemCodeEditor, ProblemStatement, SplitPane } from 'components';
import { useRouter } from 'hooks';
import Custom404 from 'pages/404';
import React from 'react';
import { ContestResponseDTO } from 'types';

export const ViewProblem = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { query } = useRouter();
  const problem = Object.values(contest?.problems).find(problem => problem.index === query.index as string);
  
  const { user } = contest;
  if (!problem) {
    return <Custom404 />;
  }
  
  return (
    <SplitPane
      minSize={80}
      className="contest-problem-split-pane"
    >
      <ProblemStatement
        problemKey={problem.key}
        author={problem.author}
        contest={{ index: query?.index as string, color: problem.color }}
        name={problem.name}
        sampleCases={problem.sampleCases}
        status={problem.status}
        statement={problem.statement}
        settings={problem.settings}
        tags={problem.tags}
      />
      <ProblemCodeEditor
        contest={{
          isAdmin: user.isAdmin,
          isJudge: user.isJudge,
          isGuest: user.isGuest,
          isSpectator: user.isSpectator,
          isContestant: user.isContestant,
          problemIndex: query?.index as string,
        }}
        problem={problem}
      />
    </SplitPane>
  );
};
