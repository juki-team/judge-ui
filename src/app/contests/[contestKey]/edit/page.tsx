'use client';

import { PageNotFound } from '@juki-team/base-ui';
import { EditCreateContest, FetcherLayer, LinkLastPath, T, TwoContentLayout, UpdateEntityLayout } from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { oneTab, toUpsertContestDTO, toUpsertContestDTOUI } from 'helpers';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ContestDataResponseDTO, LastPathKey } from 'types';

function ContestEdit() {
  
  const { routeParams: { contestKey } } = useJukiRouter();
  
  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
  ];
  
  const Error = (
    <TwoContentLayout breadcrumbs={breadcrumbs} tabs={oneTab(<PageNotFound />)}>
      <h2><T>contest not found</T></h2>
    </TwoContentLayout>
  );
  
  return (
    <FetcherLayer<ContentResponseType<ContestDataResponseDTO>>
      url={jukiApiSocketManager.API_V1.contest.getData({ params: { key: contestKey as string } }).url}
      errorView={Error}
    >
      {({ data }) => {
        if (data.content.user.isAdministrator || data.content.user.isManager) {
          return (
            <UpdateEntityLayout
              entity={toUpsertContestDTOUI(data.content)}
              entityKey={data.content.key}
              Cmp={EditCreateContest}
              viewRoute={(entityKey) => jukiAppRoutes.JUDGE().contests.view({ key: entityKey })}
              updateApiURL={JUDGE_API_V1.CONTEST.CONTEST}
              viewApiURL={entityKey => jukiApiSocketManager.API_V1.contest.getData({ params: { key: entityKey } }).url}
              toEntityUpsert={toUpsertContestDTO}
            />
          );
        }
        return Error;
      }}
    </FetcherLayer>
  );
}

export default ContestEdit;
