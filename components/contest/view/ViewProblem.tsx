import { NotFound, ProblemCodeEditor, ProblemStatement, SplitPane } from 'components/index';
import { useRouter } from 'hooks';
import { ContestResponseDTO, ContestTab } from 'types';
import { ROUTES } from '../../../config/constants';

export const ViewProblem = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { query, push } = useRouter();
  const problem = Object.values(contest?.problems).find(problem => problem.index === query.index as string);
  
  const { user } = contest;
  if (!problem) {
    return <NotFound redirectAction={() => push(ROUTES.CONTESTS.VIEW(contest.key, ContestTab.PROBLEMS))} />;
  }
  
  return (
    <SplitPane
      minSize={80}
      className="contest-problem-split-pane"
    >
      <ProblemStatement problem={problem} contestIndex={query?.index as string} />
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
