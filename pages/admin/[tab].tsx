import { AllSubmissions, FilesManagement, T, Tabs, TwoContentLayout, Users, UsersLogged } from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { AdminTab } from 'types';
import Custom404 from '../404';

function Admin() {
  
  const { query, push } = useRouter();
  const { canViewUsersManagement, canViewSubmissionsManagement, canViewFilesManagement } = useUserState();
  
  if (!canViewUsersManagement && !canViewSubmissionsManagement && !canViewFilesManagement) {
    return <Custom404 />;
  }
  const tabs = [];
  if (canViewUsersManagement) {
    tabs.push({ key: AdminTab.USERS, header: <T className="tt-ce">users</T>, body: <Users /> });
    tabs.push({ key: AdminTab.LOGGED_USERS, header: <T className="tt-ce">logged users</T>, body: <UsersLogged /> });
  }
  if (canViewSubmissionsManagement) {
    tabs.push({ key: AdminTab.SUBMISSIONS, header: <T className="tt-ce">submissions</T>, body: <AllSubmissions /> });
  }
  if (canViewFilesManagement) {
    tabs.push({ key: AdminTab.FILES_MANAGEMENT, header: <T className="tt-ce">files management</T>, body: <FilesManagement /> });
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
        onChange={tabKey => push(ROUTES.ADMIN.PAGE(tabKey as AdminTab))}
      />
    </TwoContentLayout>
  );
}

export default Admin;