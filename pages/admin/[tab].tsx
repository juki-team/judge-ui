import {
  AllSubmissions,
  FilesManagement,
  JudgersManagement,
  MailManagement,
  T,
  Tabs,
  TwoContentLayout,
  UsersManagement,
} from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserState } from 'store';
import { AdminTab } from 'types';
import Custom404 from '../404';

function Admin() {
  
  const { query, push } = useRouter();
  const {
    canViewUsersManagement,
    canViewSubmissionsManagement,
    canViewFilesManagement,
    canViewJudgersManagement,
    canViewEmailManagement,
  } = useUserState();
  
  if (!canViewUsersManagement && !canViewSubmissionsManagement && !canViewFilesManagement) {
    return <Custom404 />;
  }
  const tabs = [];
  if (canViewUsersManagement) {
    tabs.push({ key: AdminTab.USERS_MANAGEMENT, header: <T className="tt-ce">users</T>, body: <UsersManagement /> });
  }
  if (canViewSubmissionsManagement) {
    tabs.push({ key: AdminTab.SUBMISSIONS, header: <T className="tt-ce">submissions</T>, body: <AllSubmissions /> });
  }
  if (canViewFilesManagement) {
    tabs.push({ key: AdminTab.FILES_MANAGEMENT, header: <T className="tt-ce">files</T>, body: <FilesManagement /> });
  }
  if (canViewJudgersManagement) {
    tabs.push({ key: AdminTab.JUDGERS_MANAGEMENT, header: <T className="tt-ce">judgers</T>, body: <JudgersManagement /> });
  }
  if (canViewEmailManagement) {
    tabs.push({ key: AdminTab.MAIL_MANAGEMENT, header: <T className="tt-ce">mail</T>, body: <MailManagement /> });
  }
  
  return (
    <TwoContentLayout>
      <div className="jk-col filled">
        <h3><T>admin</T></h3>
        <div>my roles are</div>
      </div>
      <Tabs
        selectedTabKey={query.tab as AdminTab}
        tabs={tabs}
        onChange={tabKey => push({ pathname: ROUTES.ADMIN.PAGE(tabKey as AdminTab), query })}
      />
    </TwoContentLayout>
  );
}

export default Admin;
