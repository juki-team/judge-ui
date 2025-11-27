'use client';

import { EditCreateProblem, EntityCreateLayout, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { toUpsertProblemDTO } from 'helpers';
import { useMemo, useRouterStore, useUserStore } from 'hooks';
import { JUDGE_API_V1, PROBLEM_DEFAULT } from 'src/constants';
import { UpsertProblemDTO, UpsertProblemUIDTO } from 'types';

export default function ProblemsNewPage() {
  
  const companyKey = useUserStore(state => state.company.key);
  const userImageUrl = useUserStore(state => state.user.imageUrl);
  const userNickname = useUserStore(state => state.user.nickname);
  const userCanCreateProblems = useUserStore(state => state.user.permissions.problems.create);
  const searchParams = useRouterStore(store => store.searchParams);
  const judge = searchParams.get('judge') ?? 'juki-judge';
  
  const newEntity = useMemo(() => () => PROBLEM_DEFAULT({
    nickname: userNickname,
    imageUrl: userImageUrl,
    companyKey,
    judgeKey: judge,
    judgeIsExternal: false,
  }), [ userNickname, userImageUrl, companyKey, judge ]);
  
  if (!userCanCreateProblems) {
    return <PageNotFound />;
  }
  
  return (
    <EntityCreateLayout<UpsertProblemUIDTO, UpsertProblemDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateProblem}
      createApiURL={JUDGE_API_V1.PROBLEM.CREATE}
      listRoute={jukiAppRoutes.JUDGE().problems.list}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().problems.view({ key: entityKey })}
      toEntityUpsert={toUpsertProblemDTO}
    />
  );
}
