import { T, Tabs } from 'components';
import React from 'react';
import { AdminTab } from 'types';
import { AllUsers } from './AllUsers';
import { UsersLogged } from './UsersLogged';

export const UsersManagement = () => {
  const tabs = [
    { key: AdminTab.ALL_USERS, header: <T className="tt-ce">all users</T>, body: <AllUsers /> },
    { key: AdminTab.LOGGED_USERS, header: <T className="tt-ce">logged users</T>, body: <UsersLogged /> },
  ];
  
  return (
    <div style={{ height: '100%' }}>
      <Tabs
        tabs={tabs}
        className="height-100-percent"
      />
    </div>
  );
};
