'use client';

import { EditCreateProblem, EntityCreateLayout, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { JUDGE_API_V1, PROBLEM_DEFAULT } from 'config/constants';
import { toUpsertProblemDto } from 'helpers';
import { useMemo, useRouterStore, useUserStore } from 'hooks';
import { UpsertProblemDto, UpsertProblemUIDTO } from 'types';

export default function ProblemsNewPage() {
  
  const organizationKey = useUserStore(state => state.organization.key);
  const userImageUrl = useUserStore(state => state.user.imageUrl);
  const userNickname = useUserStore(state => state.user.nickname);
  const userCanCreateProblems = useUserStore(state => state.user.permissions.problems.create);
  const searchParams = useRouterStore(store => store.searchParams);
  const judge = searchParams.get('judge') ?? 'juki-judge';
  
  const newEntity = useMemo(() => () => PROBLEM_DEFAULT({
    nickname: userNickname,
    imageUrl: userImageUrl,
    organizationKey,
    judgeKey: judge,
    judgeIsExternal: false,
  }), [ userNickname, userImageUrl, organizationKey, judge ]);
  
  if (!userCanCreateProblems) {
    return <PageNotFound />;
  }
  
  return (
    <EntityCreateLayout<UpsertProblemUIDTO, UpsertProblemDto, {}>
      newEntity={newEntity}
      Cmp={EditCreateProblem}
      createApiURL={JUDGE_API_V1.PROBLEM.CREATE}
      listRoute={jukiAppRoutes.JUDGE().problems.list}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().problems.view({ key: entityKey })}
      toEntityUpsert={toUpsertProblemDto}
    />
  );
}
