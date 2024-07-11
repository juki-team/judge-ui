import { EditCreateProblem, FetcherLayer, UpdateEntityLayout } from 'components';
import { jukiSettings } from 'config';
import { getJudgeKeyOfProblemJudgeKey, getProblemJudgeKey, toUpsertProblemDTO } from 'helpers';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ProblemDataResponseDTO, UpsertProblemUIDTO } from 'types';
import { JUDGE_API_V1 } from '../../../../config/constants';
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
    owner: problem.owner,
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
              viewRoute={(entityKey) => jukiSettings.ROUTES.problems().view({ key: getJudgeKeyOfProblemJudgeKey(entityKey).key })}
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
