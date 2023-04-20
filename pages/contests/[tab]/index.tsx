import {
  Breadcrumbs,
  ContestsAllList,
  ContestsEndlessList,
  ContestsLiveList,
  ContestsPastList,
  ContestsUpcomingList,
  CreateContestButton,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { ROUTES } from 'config/constants';
import { useJukiUser, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { ContestsTab, LastLinkKey } from 'types';

function Contests() {
  
  useTrackLastPath(LastLinkKey.CONTESTS);
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { isReady, query: { tab: contestsTab, ...query }, push } = useRouter();
  const { user: { canCreateContest } } = useJukiUser();
  useEffect(() => {
    if (isReady && (![
      ContestsTab.ALL,
      ContestsTab.ENDLESS,
      ContestsTab.LIVE,
      ContestsTab.UPCOMING,
      ContestsTab.PAST,
    ].includes(contestsTab as ContestsTab))) {
      void push({
        pathname: ROUTES.CONTESTS.LIST(ContestsTab.ALL),
        query,
      }, undefined, { shallow: true });
    }
  }, [ isReady, contestsTab ]);
  
  const pushTab = (tab: ContestsTab) => push({
    pathname: ROUTES.CONTESTS.LIST(tab),
    query,
  }, undefined, { shallow: true });
  
  const tabs = {
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
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">contests</T>,
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
            selectedTabKey={contestsTab}
            extraNodes={extraNodes}
            extraNodesPlacement="bottomRight"
          />
        </div>
      </div>
      {tabs[contestsTab as ContestsTab]?.body}
    </TwoContentSection>
  );
}

export default Contests;
