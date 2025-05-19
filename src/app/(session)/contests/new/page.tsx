'use client';

import { CreateEntityLayout, EditCreateContest, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { isStringJson, toUpsertContestDTO } from 'helpers';
import { useMemo, useUserStore } from 'hooks';
import { CONTEST_DEFAULT, JUDGE_API_V1, LS_INITIAL_CONTEST_KEY } from 'src/constants';
import { UpsertContestDTO, UpsertContestDTOUI } from 'types';

function ContestCreate() {
  
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
    <CreateEntityLayout<UpsertContestDTOUI, UpsertContestDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateContest}
      createApiURL={JUDGE_API_V1.CONTEST.CREATE}
      listRoute={jukiAppRoutes.JUDGE().contests.list}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
      toEntityUpsert={toUpsertContestDTO}
    />
  );
}

export default ContestCreate;
