import { EditCreateContest, FetcherLayer, LinkLastPath, T, TwoContentLayout, UpdateEntityLayout } from 'components';
import { jukiSettings } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { oneTab, toUpsertContestDTO, toUpsertContestDTOUI } from 'helpers';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ContestDataResponseDTO, LastPathKey } from 'types';
import Custom404 from '../../../404';

function ContestEdit() {
  
  const { routeParams: { key: contestKey } } = useJukiRouter();
  
  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
  ];
  
  const Error = (
    <TwoContentLayout breadcrumbs={breadcrumbs} tabs={oneTab(<Custom404 />)}>
      <h2><T>contest not found</T></h2>
    </TwoContentLayout>
  );
  
  return (
    <FetcherLayer<ContentResponseType<ContestDataResponseDTO>>
      url={jukiSettings.API.contest.getData({ params: { key: contestKey as string } }).url}
      errorView={Error}
    >
      {({ data }) => {
        if (data.content.user.isAdministrator || data.content.user.isManager) {
          return (
            <UpdateEntityLayout
              entity={toUpsertContestDTOUI(data.content)}
              entityKey={data.content.key}
              Cmp={EditCreateContest}
              viewRoute={(entityKey) => jukiSettings.ROUTES.contests().view({ key: entityKey })}
              updateApiURL={JUDGE_API_V1.CONTEST.CONTEST}
              viewApiURL={entityKey => jukiSettings.API.contest.getData({ params: { key: entityKey } }).url}
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
