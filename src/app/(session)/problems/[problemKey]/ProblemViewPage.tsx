'use client';

import { TourProvider } from '@reactour/tour';
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
import { jukiApiManager } from 'config';
import { oneTab } from 'helpers';
import { useCheckAndStartServices, useTrackLastPath } from 'hooks';
import { ContentResponseType, LastPathKey, ProblemDataResponseDTO } from 'types';

const ContentStatistics = () => {
  return (
    <div>
      <T className="tt-se fw-bd">¡new!</T>&nbsp;<T className="tt-se">explore the statistics of the problem</T>
    </div>
  );
};

const steps = [
  {
    selector: '.jk-tabs-inline-tab-statistics',
    content: ContentStatistics,
  },
];

export default function ProblemViewPage({ problemKey }: { problemKey: string }) {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  useCheckAndStartServices();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemDataResponseDTO>>
      url={jukiApiManager.API_V1.problem.getData({ params: { key: problemKey as string } }).url}
      loadingView={
        <TwoContentLayout loading>
          <h2 className="line-height-1">
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
          <h2 className="line-height-1"><T>problem not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data, mutate }) => (
        <TourProvider
          steps={steps}
          onClickHighlighted={(_, { setIsOpen }) => {
            setIsOpen(false);
          }}
          highlightedMaskClassName="testing-abc"
          maskClassName="jk-tour-mask"
          disableInteraction
          showBadge={false}
          showNavigation={false}
          showCloseButton={false}
        >
          <ProblemViewLayout problem={data.content} reloadProblem={mutate} />
        </TourProvider>
      )}
    </FetcherLayer>
  );
};
