import { T, TabsInline } from 'components';
import { useJukiUI } from 'hooks';
import React from 'react';
import { AdminTab } from 'types';
import { CodeforcesManagement } from './CodeforcesManagement';

export const JudgesManagement = () => {
  const tabs = {
    [AdminTab.CODEFORCES_JUDGE]: {
      key: AdminTab.CODEFORCES_JUDGE,
      header: <T className="tt-ce ws-np">codeforces</T>,
      body: <CodeforcesManagement />,
    },
  };
  
  const { router: { searchParams, setSearchParam } } = useJukiUI();
  const selectedTabKey = searchParams.get('judgeTab') || AdminTab.CODEFORCES_JUDGE;
  const pushTab = tabKey => setSearchParam({ name: 'judgeTab', value: tabKey });
  
  return (
    <div style={{ height: '100%' }}>
      <TabsInline
        tabs={tabs}
        selectedTabKey={selectedTabKey}
        onChange={pushTab}
      />
      <div style={{ height: 'calc(100% - 40px)' }}>
        {tabs[selectedTabKey]?.body}
      </div>
    </div>
  );
};
