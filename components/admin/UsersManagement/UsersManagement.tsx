import { T, TabsInline } from 'components';
import { useJukiUI } from 'hooks';
import React from 'react';
import { AdminTab } from 'types';
import { AllUsers } from './AllUsers';
import { UsersLogged } from './UsersLogged';

export const UsersManagement = () => {
  
  const { router: { setSearchParam, searchParams } } = useJukiUI();
  const tabs = {
    [AdminTab.ALL_USERS]: {
      key: AdminTab.ALL_USERS,
      header: <T className="tt-ce ws-np">all users</T>,
      body: <AllUsers />,
    },
    [AdminTab.LOGGED_USERS]: {
      key: AdminTab.LOGGED_USERS,
      header: <T className="tt-ce ws-np">logged users</T>,
      body: <UsersLogged />,
    },
  };
  
  const selectedTabKey = searchParams.get('userTab') || AdminTab.ALL_USERS;
  const pushTab = tabKey => setSearchParam({ name: 'userTab', value: tabKey });
  
  return (
    <div style={{ height: '100%' }}>
      <TabsInline
        tabs={tabs}
        onChange={pushTab}
        selectedTabKey={selectedTabKey}
      />
      <div style={{ height: 'calc(100% - 40px)' }}>
        {tabs[selectedTabKey]?.body}
      </div>
    </div>
  );
};
