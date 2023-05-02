import { T, TabsInline } from 'components';
import { useJukiUI } from 'hooks';
import React from 'react';
import { AdminTab } from 'types';
import { CodeforcesManagement } from './CodeforcesManagement';
import { VirtualSubmissionsQueueManagement } from './VirtualSubmissionsQueueManagement';
import { VirtualUsersTable } from './VirtualUsersTable';

export const JudgesManagement = () => {
  const tabs = {
    [AdminTab.VIRTUAL_SUBMISSIONS_QUEUE]: {
      key: AdminTab.VIRTUAL_SUBMISSIONS_QUEUE,
      header: <T className="tt-ce ws-np">virtual submissions queue</T>,
      body: <VirtualSubmissionsQueueManagement />,
    },
    [AdminTab.VIRTUAL_USERS]: {
      key: AdminTab.VIRTUAL_USERS,
      header: <T className="tt-ce ws-np">virtual users</T>,
      body: <VirtualUsersTable />,
    },
    [AdminTab.CODEFORCES_JUDGE]: {
      key: AdminTab.CODEFORCES_JUDGE,
      header: <T className="tt-ce ws-np">codeforces</T>,
      body: <CodeforcesManagement />,
    },
  };
  
  const { router: { searchParams, setSearchParam } } = useJukiUI();
  const selectedTabKey = searchParams.get('judgeTab') || AdminTab.VIRTUAL_SUBMISSIONS_QUEUE;
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
