'use client';

import { EditCreateContest } from 'components';
import { EntityCreateLayout, PageNotFound, useUserStore } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { CONTEST_DEFAULT, JUDGE_API_V1, LS_INITIAL_CONTEST_KEY } from 'config/constants';
import { toUpsertContestDTO } from 'helpers';
import { type UpsertContestDTO } from '@juki-team/commons/dto';
import { isStringJson } from '@juki-team/commons/helpers';
import { useMemo } from 'hooks';
import { UpsertContestDTOUI } from 'types';
import { ContestsTab } from '@juki-team/base-ui/enums';

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
