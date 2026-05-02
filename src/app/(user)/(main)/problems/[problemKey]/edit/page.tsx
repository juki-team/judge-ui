'use client';

import { EditCreateProblem, ProblemNotFoundCard } from 'components';
import { EntityUpdateLayout, FetcherLayer, useRouterStore } from '@juki-team/base-ui';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { JUDGE_API_V1 } from 'config/constants';
import { toUpsertProblemDTO } from 'helpers';
import type { UpsertProblemUIDTO } from 'types';
import type { ProblemDataResponseDTO } from '@juki-team/commons/dto';
import type { ContentResponse } from '@juki-team/commons/types';

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
    <FetcherLayer<ContentResponse<ProblemDataResponseDTO>>
      url={jukiApiManager.apiV2.problem.getData({ params: { key: problemKey as string } }).url}
      errorView={<ProblemNotFoundCard />}
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
              viewApiURL={entityKey => jukiApiManager.apiV2.problem.getData({ params: { key: entityKey } }).url}
              toEntityUpsert={toUpsertProblemDTO}
            />
          );
        }
        return <ProblemNotFoundCard />;
      }}
    </FetcherLayer>
  );
}

export default ProblemEdit;
