import { CreateEntityLayout, EditCreateProblem } from 'components';
import { JUDGE_API_V1, PROBLEM_DEFAULT, ROUTES } from 'config/constants';
import { toUpsertProblemDTO } from 'helpers';
import { useJukiUser } from 'hooks';
import { ProblemTab, UpsertProblemDTO, UpsertProblemUIDTO } from 'types';
import Custom404 from '../../404';

function ProblemCreate() {
  
  const { user: { permissions: { problem: { create } } } } = useJukiUser();
  
  if (!create) {
    return <Custom404 />;
  }
  
  return (
    <CreateEntityLayout<UpsertProblemUIDTO, UpsertProblemDTO, {}>
      newEntity={PROBLEM_DEFAULT}
      Cmp={EditCreateProblem}
      createApiURL={JUDGE_API_V1.PROBLEM.CREATE}
      listRoute={ROUTES.PROBLEMS.LIST}
      viewRoute={(entityKey) => ROUTES.PROBLEMS.VIEW(entityKey, ProblemTab.STATEMENT)}
      toEntityUpsert={toUpsertProblemDTO}
    />
  );
}

export default ProblemCreate;
