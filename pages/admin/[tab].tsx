import {
  AllSubmissions,
  Breadcrumbs,
  FilesManagement,
  MailManagement,
  RunnersManagement,
  T,
  TabsInline,
  TwoContentSection,
  UsersManagement,
} from 'components';
import { ROUTES } from 'config/constants';
import { useJukiUser, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { AdminTab, LastLinkKey } from 'types';
import Custom404 from '../404';

function Admin() {
  
  useTrackLastPath(LastLinkKey.SECTION_ADMIN);
  const { query, push } = useRouter();
  const {
    user: {
      canViewUsersManagement,
      canViewSubmissionsManagement,
      canViewFilesManagement,
      canViewRunnersManagement,
      canViewEmailManagement,
    },
  } = useJukiUser();
  
  if (!canViewUsersManagement && !canViewSubmissionsManagement && !canViewFilesManagement) {
    return <Custom404 />;
  }
  const tabs: { [key: string]: { key: string, header: ReactNode, body: ReactNode } } = {};
  if (canViewUsersManagement) {
    tabs[AdminTab.USERS_MANAGEMENT] = {
      key: AdminTab.USERS_MANAGEMENT,
      header: <T className="tt-ce ws-np">users</T>,
      body: <div className="pad-left-right pad-bottom"><UsersManagement /></div>,
    };
  }
  if (canViewSubmissionsManagement) {
    tabs[AdminTab.SUBMISSIONS] = {
      key: AdminTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: <div className="pad-left-right pad-top-bottom"><AllSubmissions /></div>,
    };
  }
  if (canViewFilesManagement) {
    tabs[AdminTab.FILES_MANAGEMENT] = {
      key: AdminTab.FILES_MANAGEMENT,
      header: <T className="tt-ce ws-np">files</T>,
      body: <div className="pad-left-right pad-top-bottom"><FilesManagement /></div>,
    };
  }
  if (canViewRunnersManagement) {
    tabs[AdminTab.RUNNERS_MANAGEMENT] = {
      key: AdminTab.RUNNERS_MANAGEMENT,
      header: <T className="tt-ce ws-np">runners</T>,
      body: <div className="pad-left-right pad-bottom"><RunnersManagement /></div>,
    };
  }
  if (canViewEmailManagement) {
    tabs[AdminTab.MAIL_MANAGEMENT] = {
      key: AdminTab.MAIL_MANAGEMENT,
      header: <T className="tt-ce ws-np">email</T>,
      body: <div className="pad-left-right pad-top-bottom pad-bottom"><MailManagement /></div>,
    };
  }
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <Link href={ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT)} className="link"><T className="tt-se">admin</T></Link>,
    tabs[query.tab as string]?.header,
  ];
  const pushTab = tabKey => push({ pathname: ROUTES.ADMIN.PAGE(tabKey as AdminTab), query });
  
  return (
    <TwoContentSection>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right">
          <h3 style={{ padding: 'var(--pad-sm) 0' }}><T>admin</T></h3>
        </div>
        <div className="pad-left-right">
          <TabsInline tabs={tabs} onChange={pushTab} selectedTabKey={query.tab} />
        </div>
      </div>
      {tabs[query.tab as string]?.body}
    </TwoContentSection>
  );
}

export default Admin;
