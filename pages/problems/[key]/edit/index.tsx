import { EditCreateProblem, FetcherLayer, UpdateEntityLayout } from 'components';
import { jukiSettings } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { toUpsertProblemDTO } from 'helpers';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ProblemDataResponseDTO, UpsertProblemUIDTO } from 'types';
import Custom404 from '../../../404';

function toUpsertWorksheetDTO(problem: ProblemDataResponseDTO): UpsertProblemUIDTO {
  return {
    author: problem.author,
    editorial: problem.editorial,
    judgeKey: problem.judge?.key,
    members: problem.members,
    name: problem.name,
    settings: problem.settings,
    statement: problem.statement,
    tags: problem.tags,
    owner: problem.owner,
  };
}

function ProblemEdit() {
  
  const { routeParams: { key } } = useJukiRouter();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiSettings.API.problem.getData({ params: { key: key as string } }).url}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        if (data.success && data.content.user.isManager) {
          return (
            <UpdateEntityLayout
              entity={toUpsertWorksheetDTO(data.content)}
              entityKey={data.content.key}
              Cmp={EditCreateProblem}
              viewRoute={(entityKey) => jukiSettings.ROUTES.problems().view({ key: entityKey })}
              updateApiURL={JUDGE_API_V1.PROBLEM.PROBLEM}
              viewApiURL={entityKey => jukiSettings.API.problem.getData({ params: { key: entityKey } }).url}
              toEntityUpsert={toUpsertProblemDTO}
            />
          );
        }
        return <Custom404 />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
