import { Breadcrumbs, CompetitionsList, ContestList, T, TabsInline, TwoContentSection } from 'components';
import { ROUTES } from 'config/constants';
import { useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import { useEffect } from 'react';
import { ContestsTab, LastLinkKey } from 'types';

function Contests() {
  
  useTrackLastPath(LastLinkKey.CONTESTS);
  useTrackLastPath(LastLinkKey.SECTION_CONTEST);
  const { isReady, query: { tab: contestsTab, ...query }, push, pathname } = useRouter();
  
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
      body: <ContestList />,
      key: ContestsTab.CONTESTS,
      header: <T className="tt-se">contests</T>,
    },
    [ContestsTab.COMPETITIONS]: {
      body: <CompetitionsList />,
      key: ContestsTab.COMPETITIONS,
      header: <T className="tt-se">competitions</T>,
    },
  };
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <T className="tt-se">contests</T>,
  ];
  return (
    <TwoContentSection>
      <div className="jk-col extend stretch">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right">
          <h1 style={{ padding: 'var(--pad-sm) 0' }}><T>contests</T></h1>
          <TabsInline tabs={tabs} pushTab={pushTab} tabSelected={contestsTab} />
        </div>
      </div>
      {tabs[contestsTab as ContestsTab]?.body}
    </TwoContentSection>
  );
}

export default Contests;
