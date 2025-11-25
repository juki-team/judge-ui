'use client';

import {
  Button,
  ContestView,
  FetcherLayer,
  LinkLastPath,
  PageNotFound,
  T,
  TrophyIcon,
  TwoContentLayout,
} from 'components';
import { jukiApiManager } from 'config';
import { EMPTY_ENTITY_MEMBERS } from 'config/constants';
import { oneTab } from 'helpers';
import { useCheckAndStartServices, useFetcher, useMemo, useTrackLastPath, useUserStore } from 'hooks';
import React from 'react';
import {
  ContentResponseType,
  ContestClarificationsResponseDTO,
  ContestDataResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
  LastPathKey,
} from 'types';
import { ContestDataUI } from '../../../../components/contest/view/types';

export default function ContestViewPage({ contestKey }: { contestKey: string }) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  useCheckAndStartServices();
  // const { Link } = useUIStore(store => store.components);
  const companyKey = useUserStore(state => state.company.key);
  
  // const breadcrumbs = [
  //   <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
  //   <Link
  //     href={jukiAppRoutes.JUDGE().contests.view({ key: contestKey as string })}
  //     className="link"
  //     key="key"
  //   >
  //     <div className="ws-np">{contestKey}</div>
  //   </Link>,
  // ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestDataResponseDTO>>
      url={jukiApiManager.API_V2.contest.getData({ params: { key: contestKey as string, companyKey } }).url}
      loadingView={
        <TwoContentLayout
          // breadcrumbs={breadcrumbs}
          loading
        >
          <h2 className="line-height-1">
            {contestKey}
          </h2>
        </TwoContentLayout>
      }
      errorView={
        <TwoContentLayout
          // breadcrumbs={breadcrumbs}
          tabs={oneTab(
            <PageNotFound>
              <p>
                <T className="tt-se">the contest does not exist or you do not have permissions to view it</T>
              </p>
              <LinkLastPath lastPathKey={LastPathKey.CONTESTS}>
                <Button icon={<TrophyIcon />}>
                  <T className="tt-se">go to contest list</T>
                </Button>
              </LinkLastPath>
            </PageNotFound>,
          )}
        >
          <h2 className="line-height-1"><T>contest not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data: { content: contest } }) => {
        return <ContestDataView contest={contest} />;
      }}
    </FetcherLayer>
  );
};

const ContestDataView = ({ contest }: { contest: ContestDataResponseDTO }) => {
  const companyKey = useUserStore(state => state.company.key);
  const { data: dataEvents } = useFetcher<ContentResponseType<ContestEventsResponseDTO>>(
    jukiApiManager.API_V2.contest.getDataEvents({ params: { key: contest.key, companyKey } }).url,
  );
  const { data: dataMembers } = useFetcher<ContentResponseType<ContestMembersResponseDTO>>(
    jukiApiManager.API_V2.contest.getDataMembers({ params: { key: contest.key, companyKey } }).url,
  );
  const { data: dataClarifications } = useFetcher<ContentResponseType<ContestClarificationsResponseDTO>>(
    jukiApiManager.API_V2.contest.getDataClarifications({ params: { key: contest.key, companyKey } }).url,
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
  
  return <ContestView contest={contestData} />;
};
