import { AssignmentIcon, Button, ContestView, FetcherLayer, LinkLastPath, T, TwoContentLayout } from 'components';
import { jukiSettings } from 'config';
import { oneTab } from 'helpers';
import { useJukiRouter, useJukiUI, useTrackLastPath } from 'hooks';
import React from 'react';
import { ContentResponseType, ContestDataResponseDTO, LastPathKey } from 'types';
import Custom404 from '../../404';

export default function ContestViewPage() {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const { searchParams, routeParams: { key: contestKey } } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  
  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.PROBLEMS} key="problems"><T className="tt-se">contests</T></LinkLastPath>,
    <Link
      href={{
        pathname: jukiSettings.ROUTES.contests().view({ key: contestKey as string }),
        search: searchParams.toString(),
      }}
      className="link"
      key="key"
    >
      <div className="ws-np">{contestKey}</div>
    </Link>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestDataResponseDTO>>
      url={jukiSettings.API.contest.getData({ params: { key: contestKey as string } }).url}
      loadingView={
        <TwoContentLayout breadcrumbs={breadcrumbs} loading>
          <h2
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(100vw - var(--pad-md) - var(--pad-md) - 64px - var(--left-vertical-menu-width))',
            }}
          >
            {contestKey}
          </h2>
        </TwoContentLayout>
      }
      errorView={
        <TwoContentLayout
          breadcrumbs={breadcrumbs}
          tabs={oneTab(
            <Custom404>
              <p>
                <T className="tt-se">the contest does not exist or you do not have permissions to view it</T>
              </p>
              <LinkLastPath lastPathKey={LastPathKey.CONTESTS}>
                <Button icon={<AssignmentIcon />} type="light">
                  <T className="tt-se">go to contest list</T>
                </Button>
              </LinkLastPath>
            </Custom404>,
          )}
        >
          <h2><T>contest not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data: { content: contest }, mutate }) => {
        console.log(contest);
        return <ContestView contest={contest} mutate={mutate} />;
      }}
    </FetcherLayer>
  );
};
