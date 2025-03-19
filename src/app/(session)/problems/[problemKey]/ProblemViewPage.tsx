'use client';

import {
  AssignmentIcon,
  Button,
  FetcherLayer,
  LinkLastPath,
  PageNotFound,
  ProblemViewLayout,
  T,
  TwoContentLayout,
} from 'components';
import { jukiApiSocketManager } from 'config';
import { oneTab } from 'helpers';
import { useRouterStore, useRunnerServicesWakeUp, useTrackLastPath } from 'hooks';
import { ContentResponseType, LastPathKey, ProblemDataResponseDTO } from 'types';

export default function ProblemViewPage() {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  useRunnerServicesWakeUp();
  const problemKey = useRouterStore(state => state.routeParams.problemKey);
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiApiSocketManager.API_V1.problem.getData({ params: { key: problemKey as string } }).url}
      loadingView={
        <TwoContentLayout loading>
          <h2>
            {problemKey}
          </h2>
        </TwoContentLayout>
      }
      errorView={
        <TwoContentLayout
          // breadcrumbs={breadcrumbs}
          tabs={oneTab(
            <PageNotFound>
              <p>
                <T className="tt-se">the problem does not exist or you do not have permissions to view it</T>
              </p>
              <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
                <Button icon={<AssignmentIcon />} type="light">
                  <T className="tt-se">go to problem list</T>
                </Button>
              </LinkLastPath>
            </PageNotFound>,
          )}
        >
          <h2><T>problem not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data, mutate }) => (
        <ProblemViewLayout problem={data.content} reloadProblem={mutate} />
      )}
    </FetcherLayer>
  );
};
