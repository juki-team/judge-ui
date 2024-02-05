import { ProblemCodeEditor, ProblemStatement, SplitPane, T } from 'components';
import { useJukiRouter, useJukiUI } from 'hooks';
import Custom404 from 'pages/404';
import React from 'react';
import { ContestResponseDTO, Judge } from 'types';

export const ViewProblem = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { routeParams } = useJukiRouter();
  const { viewPortSize } = useJukiUI();
  const problem = Object.values(contest?.problems).find(problem => problem.index === routeParams.index as string);
  
  const { user } = contest;
  if (!problem) {
    return <Custom404 />;
  }
  
  const isMobileViewPort = viewPortSize === 'sm';
  
  return (
    <SplitPane
      minSize={80}
      className="contest-problem-split-pane"
      closableSecondPane={isMobileViewPort ? {
        expandLabel: <T className="label tx-t">code editor</T>,
        align: 'center',
      } : undefined}
      closableFirstPane={isMobileViewPort ? {
        expandLabel: <T className="label tx-t">problem statement</T>,
        align: 'center',
      } : undefined}
      onePanelAtATime={isMobileViewPort}
    >
      <ProblemStatement
        judge={problem.judge}
        problemKey={problem.key}
        author={problem.author}
        contest={{ index: routeParams?.index as string, color: problem.color }}
        name={problem.name}
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
          problemIndex: routeParams?.index as string,
          key: contest.key,
          languages: {
            [Judge.CUSTOMER]: contest.settings.languages,
            [Judge.JUKI_JUDGE]: contest.settings.languages,
            [Judge.CODEFORCES]: [],
            [Judge.TOPCODER]: [],
            [Judge.CODEFORCES_GYM]: [],
            [Judge.AT_CODER]: [],
            [Judge.UVA_ONLINE_JUDGE]: [],
            [Judge.CODECHEF]: [],
            [Judge.JV_UMSA]: [],
          },
        }}
        problem={problem}
      />
    </SplitPane>
  );
};
