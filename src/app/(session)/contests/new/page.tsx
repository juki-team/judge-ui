'use client';

import { EditCreateContest, EntityCreateLayout, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { isStringJson, toUpsertContestDTO } from 'helpers';
import { useMemo, useUserStore } from 'hooks';
import { CONTEST_DEFAULT, JUDGE_API_V1, LS_INITIAL_CONTEST_KEY } from 'src/constants';
import { ContestsTab, UpsertContestDTO, UpsertContestDTOUI } from 'types';

export default function ContestsNewPage() {
  
  const {
    nickname,
    imageUrl,
    permissions: { contests: { create: canCreateContest } },
  } = useUserStore(state => state.user);
  const companyKey = useUserStore(state => state.company.key);
  
  const localStorageInitialContest = localStorage.getItem(LS_INITIAL_CONTEST_KEY) || '{}';
  
  const newEntity = useMemo(() => () => CONTEST_DEFAULT({
    nickname,
    imageUrl,
    company: { key: companyKey },
  }, isStringJson(localStorageInitialContest) ? JSON.parse(localStorageInitialContest) : {}), [ nickname, imageUrl, companyKey, localStorageInitialContest ]);
  
  if (!canCreateContest) {
    return <PageNotFound />;
  }
  
  return (
    <EntityCreateLayout<UpsertContestDTOUI, UpsertContestDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateContest}
      createApiURL={JUDGE_API_V1.CONTEST.CREATE}
      listRoute={() => jukiAppRoutes.JUDGE().contests.list({ tab: ContestsTab.CLASSICS })}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
      toEntityUpsert={toUpsertContestDTO}
    />
  );
}
