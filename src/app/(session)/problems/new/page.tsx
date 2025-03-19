'use client';

import { CreateEntityLayout, EditCreateProblem, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { JUDGE_API_V1, PROBLEM_DEFAULT } from 'config/constants';
import { getJudgeKeyOfProblemJudgeKey, toUpsertProblemDTO } from 'helpers';
import { useMemo, useUserStore } from 'hooks';
import { UpsertProblemDTO, UpsertProblemUIDTO } from 'types';

function ProblemCreate() {
  
  const companyKey = useUserStore(state => state.company.key);
  const userImageUrl = useUserStore(state => state.user.imageUrl);
  const userNickname = useUserStore(state => state.user.nickname);
  const userCanCreateProblems = useUserStore(state => state.user.permissions.problems.create);
  
  const newEntity = useMemo(() => () => PROBLEM_DEFAULT({
    nickname: userNickname,
    imageUrl: userImageUrl,
    companyKey,
    judgeKey: companyKey,
    judgeIsExternal: false,
  }), [ userNickname, userImageUrl, companyKey ]);
  
  if (!userCanCreateProblems) {
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
