'use client';

import {
  Button,
  ContestView,
  FetcherLayer,
  LinkLastPath,
  PageNotFound,
  T,
  TrophyIcon,
  TwoContentLayout,
} from 'components';
import { jukiApiManager } from 'config';
import { oneTab } from 'helpers';
import { useCheckAndStartServices, useTrackLastPath, useUserStore } from 'hooks';
import React from 'react';
import { ContentResponseType, ContestDataResponseDTO, LastPathKey } from 'types';

export default function ContestViewPage({ contestKey }: { contestKey: string }) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  useCheckAndStartServices();
  // const { components: { Link } } = useJukiUI();
  const companyKey = useUserStore(state => state.company.key);
  
  // const breadcrumbs = [
  //   <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
  //   <Link
  //     href={jukiAppRoutes.JUDGE().contests.view({ key: contestKey as string })}
  //     className="link"
  //     key="key"
  //   >
  //     <div className="ws-np">{contestKey}</div>
  //   </Link>,
  // ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestDataResponseDTO>>
      url={jukiApiManager.API_V1.contest.getData({ params: { key: contestKey as string, companyKey } }).url}
      loadingView={
        <TwoContentLayout
          // breadcrumbs={breadcrumbs}
          loading
        >
          <h2 className="line-height-1">
            {contestKey}
          </h2>
        </TwoContentLayout>
      }
      errorView={
        <TwoContentLayout
          // breadcrumbs={breadcrumbs}
          tabs={oneTab(
            <PageNotFound>
              <p>
                <T className="tt-se">the contest does not exist or you do not have permissions to view it</T>
              </p>
              <LinkLastPath lastPathKey={LastPathKey.CONTESTS}>
                <Button icon={<TrophyIcon />}>
                  <T className="tt-se">go to contest list</T>
                </Button>
              </LinkLastPath>
            </PageNotFound>,
          )}
        >
          <h2 className="line-height-1"><T>contest not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data: { content: contest } }) => {
        return <ContestView contest={contest} />;
      }}
    </FetcherLayer>
  );
};
