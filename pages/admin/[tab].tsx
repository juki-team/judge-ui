import { AllSubmissions, T, Tabs, TwoContentLayout, Users } from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { AdminTab } from 'types';
import Custom404 from '../404';

function Admin() {
  
  const { query, push } = useRouter();
  const { canViewUsersManagement, canViewSubmissionsManagement } = useUserState();
  
  if (!canViewUsersManagement && !canViewSubmissionsManagement) {
    return <Custom404 />;
  }
  const tabs = [];
  if (canViewUsersManagement) {
    tabs.push({ key: AdminTab.USERS, header: <T className="tt-ce">users</T>, body: <Users /> });
    tabs.push({ key: AdminTab.LOGGED_USERS, header: <T className="tt-ce">logged users</T>, body: <Users /> });
  }
  if (canViewSubmissionsManagement) {
    tabs.push({ key: AdminTab.SUBMISSIONS, header: <T className="tt-ce">submissions</T>, body: <AllSubmissions /> });
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