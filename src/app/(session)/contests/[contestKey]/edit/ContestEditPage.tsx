'use client';

import {
  EditCreateContest,
  EntityUpdateLayout,
  FetcherLayer,
  LinkLastPath,
  PageNotFound,
  T,
  TwoContentLayout,
} from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { EMPTY_ENTITY_MEMBERS, JUDGE_API_V1 } from 'config/constants';
import { oneTab, toUpsertContestDTO, toUpsertContestDTOUI } from 'helpers';
import { useFetcher, useMemo, useUserStore } from 'hooks';
import React from 'react';
import {
  ContentResponseType,
  ContestClarificationsResponseDTO,
  ContestDataResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
  LastPathKey,
} from 'types';
import { ContestDataUI } from '../../../../../components/contest/view/types';

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
    <FetcherLayer<ContentResponseType<ContestDataResponseDTO>>
      url={jukiApiManager.API_V1.contest.getData({ params: { key: contestKey as string } }).url}
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
  const companyKey = useUserStore(state => state.company.key);
  const { data: dataEvents } = useFetcher<ContentResponseType<ContestEventsResponseDTO>>(
    jukiApiManager.API_V1.contest.getDataEvents({ params: { key: contest.key, companyKey } }).url,
  );
  const { data: dataMembers } = useFetcher<ContentResponseType<ContestMembersResponseDTO>>(
    jukiApiManager.API_V1.contest.getDataMembers({ params: { key: contest.key, companyKey } }).url,
  );
  const { data: dataClarifications } = useFetcher<ContentResponseType<ContestClarificationsResponseDTO>>(
    jukiApiManager.API_V1.contest.getDataClarifications({ params: { key: contest.key, companyKey } }).url,
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
  
  return (
    <EntityUpdateLayout
      entity={toUpsertContestDTOUI(contestData)}
      entityKey={contest.key}
      Cmp={EditCreateContest}
      viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
      updateApiURL={() => JUDGE_API_V1.CONTEST.CONTEST}
      viewApiURL={entityKey => jukiApiManager.API_V1.contest.getData({ params: { key: entityKey } }).url}
      toEntityUpsert={toUpsertContestDTO}
    />
  );
};
