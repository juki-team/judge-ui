'use client';

import { EntityCreateLayout, PageNotFound, useRouterStore, useUserStore } from '@juki-team/base-ui';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { type UpsertProblemDTO } from '@juki-team/commons/dto';
import { EditCreateProblem } from 'components';
import { PROBLEM_DEFAULT } from 'config/constants';
import { toUpsertProblemDTO } from 'helpers';
import { useMemo } from 'hooks';
import { UpsertProblemUIDTO } from 'types';

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

  const { url } = jukiApiManager.apiV2.problem.create();

  return (
    <EntityCreateLayout<UpsertProblemUIDTO, UpsertProblemDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateProblem}
      createApiURL={() => url}
      listRoute={jukiAppRoutes.JUDGE().problems.list}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().problems.view({ key: entityKey })}
      toEntityUpsert={toUpsertProblemDTO}
    />
  );
}
