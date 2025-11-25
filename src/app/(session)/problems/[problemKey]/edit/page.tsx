'use client';

import { EditCreateProblem, EntityUpdateLayout, FetcherLayer, PageNotFound } from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { toUpsertProblemDTO } from 'helpers';
import { useRouterStore } from 'hooks';
import { JUDGE_API_V1 } from 'src/constants';
import { ContentResponseType, ProblemDataResponseDTO, UpsertProblemUIDTO } from 'types';

function toUpsertProblemUIDTO(problem: ProblemDataResponseDTO): UpsertProblemUIDTO {
  return {
    author: problem.author,
    editorial: problem.editorial,
    judgeKey: problem.judge?.key,
    judgeIsExternal: problem.judge?.isExternal,
    members: problem.members,
    name: problem.name,
    shortname: problem.shortname,
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
    state: problem.state,
  };
}

function ProblemEdit() {
  
  const problemKey = useRouterStore(state => state.routeParams.problemKey);
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiApiManager.API_V2.problem.getData({ params: { key: problemKey as string } }).url}
      errorView={<PageNotFound />}
    >
      {({ data }) => {
        if (data.success && data.content.user.isManager) {
          return (
            <EntityUpdateLayout
              entity={toUpsertProblemUIDTO(data.content)}
              entityKey={data.content.key}
              Cmp={EditCreateProblem}
              viewRoute={(entityKey) => jukiAppRoutes.JUDGE().problems.view({ key: entityKey })}
              updateApiURL={() => JUDGE_API_V1.PROBLEM.PROBLEM}
              viewApiURL={entityKey => jukiApiManager.API_V2.problem.getData({ params: { key: entityKey } }).url}
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
