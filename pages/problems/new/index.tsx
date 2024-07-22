import { CreateEntityLayout, EditCreateProblem } from 'components';
import { jukiSettings } from 'config';
import { JUDGE_API_V1, PROBLEM_DEFAULT } from 'config/constants';
import { getJudgeKeyOfProblemJudgeKey, toUpsertProblemDTO } from 'helpers';
import { useJukiUser, useMemo } from 'hooks';
import { UpsertProblemDTO, UpsertProblemUIDTO } from 'types';
import Custom404 from '../../404';

function ProblemCreate() {
  
  const {
    user: { nickname, imageUrl, permissions: { problems: { create } } },
    company: { key: companyKey },
  } = useJukiUser();
  const newEntity = useMemo(() => () => PROBLEM_DEFAULT({
    nickname,
    imageUrl,
    companyKey,
    judgeKey: companyKey,
  }), [ nickname, imageUrl, companyKey ]);
  
  if (!create) {
    return <Custom404 />;
  }
  
  return (
    <CreateEntityLayout<UpsertProblemUIDTO, UpsertProblemDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateProblem}
      createApiURL={JUDGE_API_V1.PROBLEM.CREATE}
      listRoute={jukiSettings.ROUTES.problems().list}
      viewRoute={(entityKey) => jukiSettings.ROUTES.problems().view({ key: getJudgeKeyOfProblemJudgeKey(entityKey).key })}
      toEntityUpsert={toUpsertProblemDTO}
    />
  );
}

export default ProblemCreate;
