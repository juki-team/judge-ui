'use client';

import { CreateEntityLayout, EditCreateProblem, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { JUDGE_API_V1, PROBLEM_DEFAULT } from 'config/constants';
import { getJudgeKeyOfProblemJudgeKey, toUpsertProblemDTO } from 'helpers';
import { useJukiUser, useMemo } from 'hooks';
import { UpsertProblemDTO, UpsertProblemUIDTO } from 'types';

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
    judgeIsExternal: false,
  }), [ nickname, imageUrl, companyKey ]);
  
  if (!create) {
    return <PageNotFound />;
  }
  
  return (
    <CreateEntityLayout<UpsertProblemUIDTO, UpsertProblemDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateProblem}
      createApiURL={JUDGE_API_V1.PROBLEM.CREATE}
      listRoute={jukiAppRoutes.JUDGE().problems.list}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().problems.view({ key: getJudgeKeyOfProblemJudgeKey(entityKey).key })}
      toEntityUpsert={toUpsertProblemDTO}
    />
  );
}

export default ProblemCreate;
