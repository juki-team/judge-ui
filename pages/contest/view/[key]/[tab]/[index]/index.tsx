import { Button, ContestView, CupIcon, FetcherLayer, LinkLastPath, T, TwoContentLayout } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { oneTab } from 'helpers';
import { useJukiRouter, useJukiUI } from 'hooks';
import React from 'react';
import { ContentResponseType, ContestResponseDTO, ContestTab, LastPathKey } from '../../../../../../types';
import Custom404 from '../../../../../404';

function View() {
  
  const {
    searchParams,
    routeParams,
  } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  const contestKey = routeParams.key as string;
  
  const breadcrumbs = [
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests"><T className="tt-se">contests</T></LinkLastPath>,
    <Link
      href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey, ContestTab.OVERVIEW), query: searchParams.toString() }}
      className="link"
      key="contestKey"
    >
      <div className="ws-np">{contestKey}</div>
    </Link>,
  ];
  
  const breadcrumbsLoading = [
    ...breadcrumbs,
    <T className="tt-ce ws-np" key="overview">overview</T>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ContestResponseDTO>>
      url={JUDGE_API_V1.CONTEST.CONTEST_DATA(contestKey)}
      options={{ refreshInterval: 60000 }}
      loadingView={
        <TwoContentLayout
          breadcrumbs={breadcrumbsLoading}
          selectedTabKey={ContestTab.OVERVIEW}
          loading
        >
          <h2
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 'calc(100vw - var(--pad-md) - var(--pad-md))',
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
                <Button icon={<CupIcon />} type="light"><T className="tt-se">go to contest list</T></Button>
              </LinkLastPath>
            </Custom404>,
          )}
        >
          <h3><T className="tt-ue">contest not found</T></h3>
        </TwoContentLayout>
      }
    >
      {({ data: { content: contest }, mutate }) => {
        return <ContestView contest={contest} mutate={mutate} />;
      }}
    </FetcherLayer>
  
  );
}

export default View;
