'use client';

import { EditCreateProblem } from 'components';
import { EntityCreateLayout, PageNotFound, useRouterStore, useUserStore } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { JUDGE_API_V1, PROBLEM_DEFAULT } from 'config/constants';
import { toUpsertProblemDTO } from 'helpers';
import { useMemo } from 'hooks';
import { UpsertProblemUIDTO } from 'types';
import { type UpsertProblemDTO } from '@juki-team/commons/dto';

export default function ProblemsNewPage() {
  
  const companyKey = useUserStore(state => state.organization.key);
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
