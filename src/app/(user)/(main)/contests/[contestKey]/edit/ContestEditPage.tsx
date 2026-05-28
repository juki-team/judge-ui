'use client';

import {
  EntityUpdateLayout,
  FetcherLayer,
  LinkLastPath,
  PageNotFound,
  T,
  TwoContentLayout,
  useFetcher,
  useUserStore,
} from '@juki-team/base-ui';
import { oneTab } from '@juki-team/base-ui/helpers';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { EMPTY_ENTITY_MEMBERS } from '@juki-team/commons/constants';
import {
  type ContestClarificationsResponseDTO,
  type ContestDataResponseDTO,
  type ContestEventsResponseDTO,
  type ContestMembersResponseDTO,
} from '@juki-team/commons/dto';
import { type ContentResponse } from '@juki-team/commons/types';
import { EditCreateContest } from 'components';
import { toUpsertContestDTO, toUpsertContestDTOUI } from 'helpers';
import { useMemo } from 'hooks';
import { LastPathKey } from 'types';
import { ContestDataUI } from '../../../../../../components/contest/view/types';

export function ContestEditPage({ contestKey }: { contestKey: string }) {

  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
  ];

  const Error = (
    <TwoContentLayout breadcrumbs={breadcrumbs} tabs={oneTab(<PageNotFound />)}>
      <h2><T className="tt-se">contest not found</T></h2>
    </TwoContentLayout>
  );

  return (
    <FetcherLayer<ContentResponse<ContestDataResponseDTO>>
      url={jukiApiManager.apiV2.contest.getData({ params: { key: contestKey as string } }).url}
      errorView={Error}
    >
      {({ data }) => {
        if (data.content.user.isAdministrator || data.content.user.isManager) {
          return <ContestDataEdit contest={data.content} />;
        }
        return Error;
      }}
    </FetcherLayer>
  );
}

const ContestDataEdit = ({ contest }: { contest: ContestDataResponseDTO }) => {
  const companyKey = useUserStore(state => state.organization.key);
  const { data: dataEvents, isLoading: isLoadingEvents } = useFetcher<ContentResponse<ContestEventsResponseDTO>>(
    jukiApiManager.apiV2.contest.getDataEvents({ params: { key: contest.key, organizationKey: companyKey } }).url,
  );
  const { data: dataMembers, isLoading: isLoadingMembers } = useFetcher<ContentResponse<ContestMembersResponseDTO>>(
    jukiApiManager.apiV2.contest.getDataMembers({ params: { key: contest.key, organizationKey: companyKey } }).url,
  );
  const {
    data: dataClarifications,
    isLoading: isLoadingClarifications,
  } = useFetcher<ContentResponse<ContestClarificationsResponseDTO>>(
    jukiApiManager.apiV2.contest.getDataClarifications({
      params: {
        key: contest.key,
        organizationKey: companyKey,
      },
    }).url,
  );

  const contestData: ContestDataUI = useMemo(() => {
    return {
      ...contest,
      events: dataEvents?.success ? dataEvents.content.events : [],
      members: dataMembers?.success ? dataMembers.content.members : {
        ...EMPTY_ENTITY_MEMBERS(),
        administrators: {},
        managers: {},
        guests: {},
        spectators: {},
        participants: {},
      },
      clarifications: dataClarifications?.success ? dataClarifications.content.clarifications : [],
    };
  }, [ contest, dataEvents, dataMembers, dataClarifications ]);

  if (isLoadingEvents || isLoadingMembers || isLoadingClarifications) {
    return null;
  }

  return (
    <EntityUpdateLayout
      entity={toUpsertContestDTOUI(contestData)}
      entityKey={contest.key}
      Cmp={EditCreateContest}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
      updateApiURL={() => (key) => jukiApiManager.apiV2.contest.update({ params: { key } }).url}
      viewApiURL={entityKey => jukiApiManager.apiV2.contest.getData({ params: { key: entityKey } }).url}
      toEntityUpsert={toUpsertContestDTO}
    />
  );
};
