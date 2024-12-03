'use client';

import { EditCreateProblem, FetcherLayer, PageNotFound, UpdateEntityLayout } from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { toUpsertProblemDTO } from 'helpers';
import { useJukiRouter } from 'hooks';
import { ContentResponseType, ProblemDataResponseDTO, UpsertProblemUIDTO } from 'types';

function toUpsertWorksheetDTO(problem: ProblemDataResponseDTO): UpsertProblemUIDTO {
  return {
    author: problem.author,
    editorial: problem.editorial,
    judgeKey: problem.judge?.key,
    judgeIsExternal: problem.judge?.isExternal,
    members: problem.members,
    name: problem.name,
    settings: problem.settings,
    statement: problem.statement,
    tags: problem.tags,
    owner: problem.owner,
    costs: {
      unlockEditorial: 0,
      unlockHint: 0,
      viewTestCases: 0,
    },
    rewardJukiCoins: {
      forSolving: 0,
      forSolvingFirstTry: 0,
      forSolvingInAnExtraLanguage: 0,
    },
  };
}

function ProblemEdit() {
  
  const { routeParams: { problemKey } } = useJukiRouter();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiApiSocketManager.API_V1.problem.getData({ params: { key: problemKey as string } }).url}
      errorView={<PageNotFound />}
    >
      {({ data }) => {
        if (data.success && data.content.user.isManager) {
          return (
            <UpdateEntityLayout
              entity={toUpsertWorksheetDTO(data.content)}
              entityKey={data.content.key}
              Cmp={EditCreateProblem}
              viewRoute={(entityKey) => jukiAppRoutes.JUDGE().problems.view({ key: entityKey })}
              updateApiURL={JUDGE_API_V1.PROBLEM.PROBLEM}
              viewApiURL={entityKey => jukiApiSocketManager.API_V1.problem.getData({ params: { key: entityKey } }).url}
              toEntityUpsert={toUpsertProblemDTO}
            />
          );
        }
        return <PageNotFound />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
