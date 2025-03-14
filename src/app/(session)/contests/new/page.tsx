'use client';

import { CreateEntityLayout, EditCreateContest, PageNotFound } from 'components';
import { jukiAppRoutes } from 'config';
import { CONTEST_DEFAULT, JUDGE_API_V1 } from 'config/constants';
import { toUpsertContestDTO } from 'helpers';
import { useJukiUser, useMemo } from 'hooks';
import { UpsertContestDTO, UpsertContestDTOUI } from 'types';

function ContestCreate() {
  
  const {
    user: { nickname, imageUrl, permissions: { contests: { create: canCreateContest } } },
    company: { key: companyKey },
  } = useJukiUser();
  const newEntity = useMemo(() => () => CONTEST_DEFAULT({
    nickname,
    imageUrl,
    company: { key: companyKey },
  }), [ nickname, imageUrl, companyKey ]);
  
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
