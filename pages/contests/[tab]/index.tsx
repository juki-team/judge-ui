import {
  Breadcrumbs,
  ContestsAllList,
  ContestsEndlessList,
  ContestsLiveList,
  ContestsPastList,
  ContestsUpcomingList,
  CreateContestButton,
  HomeLink,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { ROUTES } from 'config/constants';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useEffect, useJukiRouter, useJukiUI, useJukiUser, useTrackLastPath } from 'hooks';
import { ContestsTab, LastLinkKey, TabsType } from 'types';

function Contests() {
  
  useTrackLastPath(LastLinkKey.CONTESTS);
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { routeParams: { tab: contestsTab }, pushRoute, replaceRoute } = useJukiRouter();
  const { user: { canCreateContest } } = useJukiUser();
  const { viewPortSize } = useJukiUI();
  useEffect(() => {
    if (![
      ContestsTab.ALL,
      ContestsTab.ENDLESS,
      ContestsTab.LIVE,
      ContestsTab.UPCOMING,
      ContestsTab.PAST,
    ].includes(contestsTab as ContestsTab)) {
      void replaceRoute({
        pathname: ROUTES.CONTESTS.LIST(ContestsTab.ALL),
      });
    }
  }, [ contestsTab, replaceRoute ]);
  
  const pushTab = (tab: ContestsTab) => pushRoute({ pathname: ROUTES.CONTESTS.LIST(tab) });
  
  const tabs: TabsType<ContestsTab> = {
    [ContestsTab.ALL]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <ContestsAllList />
        </div>
      ),
      key: ContestsTab.ALL,
      header: <T className="tt-se ws-np">all</T>,
    },
    [ContestsTab.ENDLESS]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <ContestsEndlessList />
        </div>
      ),
      key: ContestsTab.ENDLESS,
      header: <T className="tt-se ws-np">endless</T>,
    },
    [ContestsTab.LIVE]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <ContestsLiveList />
        </div>
      ),
      key: ContestsTab.LIVE,
      header: <T className="tt-se ws-np">live</T>,
    },
    [ContestsTab.UPCOMING]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <ContestsUpcomingList />
        </div>
      ),
      key: ContestsTab.UPCOMING,
      header: <T className="tt-se ws-np">upcoming</T>,
    },
    [ContestsTab.PAST]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <ContestsPastList />
        </div>
      ),
      key: ContestsTab.PAST,
      header: <T className="tt-se ws-np">past</T>,
    },
  };
  
  const breadcrumbs = [
    <HomeLink key="home" />,
    <T className="tt-se" key="contests">contests</T>,
  ];
  
  const extraNodes = [];
  
  if (canCreateContest) {
    extraNodes.push(<CreateContestButton />);
  }
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right">
          <h2><T>contests</T></h2>
        </div>
        <div className="pad-left-right">
          <TabsInline
            tabs={tabs}
            onChange={pushTab}
            selectedTabKey={contestsTab as ContestsTab}
            extraNodes={extraNodes}
            extraNodesPlacement={viewPortSize === 'sm' ? 'bottomRight' : undefined}
          />
        </div>
      </div>
      {renderReactNodeOrFunctionP1(tabs[contestsTab as ContestsTab]?.body, { selectedTabKey: contestsTab as ContestsTab })}
    </TwoContentSection>
  );
}

export default Contests;
