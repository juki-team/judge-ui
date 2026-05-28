'use client';

import { EntityCreateLayout, PageNotFound, useUserStore } from '@juki-team/base-ui';
import { ContestsTab } from '@juki-team/base-ui/enums';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { type UpsertContestDTO } from '@juki-team/commons/dto';
import { isStringJson } from '@juki-team/commons/helpers';
import { EditCreateContest } from 'components';
import { CONTEST_DEFAULT, LS_INITIAL_CONTEST_KEY } from 'config/constants';
import { toUpsertContestDTO } from 'helpers';
import { useMemo } from 'hooks';
import { UpsertContestDTOUI } from 'types';

export default function ContestsNewPage() {

  const {
    nickname,
    imageUrl,
    permissions: { contests: { create: canCreateContest } },
  } = useUserStore(state => state.user);
  const companyKey = useUserStore(state => state.organization.key);

  const localStorageInitialContest = localStorage.getItem(LS_INITIAL_CONTEST_KEY) || '{}';

  const newEntity = useMemo(() => () => CONTEST_DEFAULT({
    nickname,
    imageUrl,
    organization: { key: companyKey },
  }, isStringJson(localStorageInitialContest) ? JSON.parse(localStorageInitialContest) : {}), [ nickname, imageUrl, companyKey, localStorageInitialContest ]);

  if (!canCreateContest) {
    return <PageNotFound />;
  }

  const { url } = jukiApiManager.apiV2.contest.create();

  return (
    <EntityCreateLayout<UpsertContestDTOUI, UpsertContestDTO, {}>
      newEntity={newEntity}
      Cmp={EditCreateContest}
      createApiURL={() => url}
      listRoute={() => jukiAppRoutes.JUDGE().contests.list({ tab: ContestsTab.CLASSICS })}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
      toEntityUpsert={toUpsertContestDTO}
    />
  );
}
