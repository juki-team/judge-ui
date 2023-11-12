import { T, TabsInline } from 'components';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter, useJukiUser } from 'hooks';
import React from 'react';
import { AdminTab, CompanyResponseDTO, TabsType } from 'types';
import { AllUsers } from './AllUsers';
import { GenerateUsers } from './GenerateUsers';
import { UsersLogged } from './UsersLogged';

export const UsersManagement = ({ company }: { company: CompanyResponseDTO }) => {
  
  const { setSearchParams, searchParams } = useJukiRouter();
  const { user: { canCreateUser } } = useJukiUser();
  const tabs: TabsType<AdminTab> = {
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
  const selectedTabKey = searchParams.get('userTab') as AdminTab || AdminTab.ALL_USERS;
  const pushTab = (tabKey: AdminTab) => setSearchParams({ name: 'userTab', value: tabKey });
  
  return (
    <div style={{ height: '100%' }}>
      <TabsInline
        tabs={tabs}
        onChange={pushTab}
        selectedTabKey={selectedTabKey}
      />
      <div style={{ height: 'calc(100% - 40px)' }}>
        {renderReactNodeOrFunctionP1(tabs[selectedTabKey]?.body, { selectedTabKey })}
      </div>
    </div>
  );
};
