'use client';

import { EditCreateContest, EntityCreateLayout, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { CONTEST_DEFAULT, JUDGE_API_V1, LS_INITIAL_CONTEST_KEY } from 'config/constants';
import { isStringJson, toUpsertContestDto } from 'helpers';
import { useMemo, useUserStore } from 'hooks';
import { ContestsTab, UpsertContestDto, UpsertContestDtoUI } from 'types';

export default function ContestsNewPage() {
  
  const {
    nickname,
    imageUrl,
    permissions: { contests: { create: canCreateContest } },
  } = useUserStore(state => state.user);
  const organizationKey = useUserStore(state => state.organization.key);
  
  const localStorageInitialContest = localStorage.getItem(LS_INITIAL_CONTEST_KEY) || '{}';
  
  const newEntity = useMemo(() => () => CONTEST_DEFAULT({
    nickname,
    imageUrl,
    organization: { key: organizationKey },
  }, isStringJson(localStorageInitialContest) ? JSON.parse(localStorageInitialContest) : {}), [ nickname, imageUrl, organizationKey, localStorageInitialContest ]);
  
  if (!canCreateContest) {
    return <PageNotFound />;
  }
  
  return (
    <EntityCreateLayout<UpsertContestDtoUI, UpsertContestDto, {}>
      newEntity={newEntity}
      Cmp={EditCreateContest}
      createApiURL={JUDGE_API_V1.CONTEST.CREATE}
      listRoute={() => jukiAppRoutes.JUDGE().contests.list({ tab: ContestsTab.CLASSICS })}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
      toEntityUpsert={toUpsertContestDto}
    />
  );
}
