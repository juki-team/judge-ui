import { ContentLayout, ContestList, CompetitionsList, T, Tabs } from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ContestsTab } from 'types';

function Contests() {
  const { isReady, query: { tab: contestsTab, ...query }, push } = useRouter();
  
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
  
  return (
    <ContentLayout>
      <Tabs
        selectedTabKey={contestsTab as string}
        tabs={[
          { key: ContestsTab.CONTESTS, body: <ContestList />, header: <T className="tt-se">contests</T> },
          { key: ContestsTab.COMPETITIONS, body: <CompetitionsList />, header: <T className="tt-se">competitions</T> },
        ]}
        onChange={tabKey => pushTab(tabKey as ContestsTab)}
      />
    </ContentLayout>
  );
}

export default Contests;
