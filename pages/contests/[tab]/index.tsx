import { Breadcrumbs, CompetitionsList, ContestList, CreateContestButton, T, TabsInline, TwoContentSection } from 'components';
import { ROUTES } from 'config/constants';
import { useJukiBase, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { ContestsTab, LastLinkKey } from 'types';

function Contests() {
  
  useTrackLastPath(LastLinkKey.CONTESTS);
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { isReady, query: { tab: contestsTab, ...query }, push } = useRouter();
  const { user: { canCreateContest } } = useJukiBase();
  useEffect(() => {
    if (isReady && (contestsTab !== ContestsTab.CONTESTS && contestsTab !== ContestsTab.COMPETITIONS)) {
      push({
        pathname: ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS),
        query,
      }, undefined, { shallow: true });
    }
  }, [isReady, contestsTab]);
  
  const pushTab = (tab: ContestsTab) => push({
    pathname: ROUTES.CONTESTS.LIST(tab),
    query,
  }, undefined, { shallow: true });
  
  const tabs = {
    [ContestsTab.CONTESTS]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <ContestList />
        </div>
      ),
      key: ContestsTab.CONTESTS,
      header: <T className="tt-se">contests</T>,
    },
    [ContestsTab.COMPETITIONS]: {
      body: (
        <div className="pad-left-right pad-top-bottom">
          <CompetitionsList />
        </div>
      ),
      key: ContestsTab.COMPETITIONS,
      header: <T className="tt-se">competitions</T>,
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
          <h1><T>contests</T></h1>
        </div>
        <div className="pad-left-right">
          <TabsInline tabs={tabs} pushTab={pushTab} tabSelected={contestsTab} extraNodes={extraNodes} />
        </div>
      </div>
      {tabs[contestsTab as ContestsTab]?.body}
    </TwoContentSection>
  );
}

export default Contests;
