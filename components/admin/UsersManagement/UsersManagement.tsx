import { T, TabsInline } from 'components';
import { useJukiUI, useJukiUser } from 'hooks';
import React from 'react';
import { AdminTab, CompanyResponseDTO } from 'types';
import { AllUsers } from './AllUsers';
import { GenerateUsers } from './GenerateUsers';
import { UsersLogged } from './UsersLogged';

export const UsersManagement = ({ company }: { company: CompanyResponseDTO }) => {
  
  const { router: { setSearchParam, searchParams } } = useJukiUI();
  const { user: { canCreateUser } } = useJukiUser();
  const tabs = {
    [AdminTab.ALL_USERS]: {
      key: AdminTab.ALL_USERS,
      header: <T className="tt-ce ws-np">all users</T>,
      body: <AllUsers company={company} />,
    },
    [AdminTab.LOGGED_USERS]: {
      key: AdminTab.LOGGED_USERS,
      header: <T className="tt-ce ws-np">logged users</T>,
      body: <UsersLogged company={company} />,
    },
  };
  if (canCreateUser) {
    tabs[AdminTab.CREATE_USERS] = {
      key: AdminTab.CREATE_USERS,
      header: <T className="tt-ce ws-np">create users</T>,
      body: <GenerateUsers company={company} />,
    };
  }
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
