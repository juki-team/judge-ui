import { EditCreateProblem, FetcherLayer, UpdateEntityLayout } from 'components';
import { jukiSettings } from 'config';
import { getProblemJudgeKey, toUpsertProblemDTO } from 'helpers';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ProblemDataResponseDTO, ProblemTab, UpsertProblemUIDTO } from 'types';
import { JUDGE_API_V1, ROUTES } from '../../../../config/constants';
import Custom404 from '../../../404';

function toUpsertWorksheetDTO(problem: ProblemDataResponseDTO): UpsertProblemUIDTO {
  return {
    author: problem.author,
    editorial: problem.editorial,
    judge: problem.judge,
    members: problem.members,
    name: problem.name,
    settings: problem.settings,
    statement: problem.statement,
    tags: problem.tags,
  };
}

function ProblemEdit() {
  
  const { routeParams: { key } } = useJukiRouter();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiSettings.API.problem.getData({ params: { problemKey: key as string } }).url}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        if (data.success && data.content.user.isManager) {
          return (
            <UpdateEntityLayout
              entity={toUpsertWorksheetDTO(data.content)}
              entityKey={getProblemJudgeKey(data.content.judge, data.content.key)}
              Cmp={EditCreateProblem}
              viewRoute={(entityKey) => ROUTES.PROBLEMS.VIEW(entityKey, ProblemTab.STATEMENT)}
              updateApiURL={JUDGE_API_V1.PROBLEM.PROBLEM}
              viewApiURL={entityKey => jukiSettings.API.problem.getData({ params: { problemKey: entityKey } }).url}
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
