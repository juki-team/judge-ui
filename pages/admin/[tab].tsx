import { T, Tabs, TwoContentLayout, Users, Submissions } from 'components';
import { ROUTES } from 'config/constants';
import { can } from 'helpers';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { AdminTab } from 'types';
import Custom404 from '../404';

function Admin() {
  
  const { query, push } = useRouter();
  const user = useUserState();
  
  if (!can.viewUsersTab(user)) {
    return <Custom404 />;
  }
  
  return (
    <TwoContentLayout>
      <div className="jk-col filled">
        <h3><T>admin</T></h3>
        <div>my roles are</div>
      </div>
      <Tabs
        selectedTabKey={query.tab as AdminTab}
        tabs={[
          { key: AdminTab.USERS, header: <T className="text-capitalize">users</T>, body: <Users /> },
          { key: AdminTab.SUBMISSIONS, header: <T className="text-capitalize">submissions</T>, body: <Submissions /> },
        ]}
        onChange={tabKey => push(ROUTES.ADMIN.PAGE(tabKey as AdminTab))}
      />
    </TwoContentLayout>
  );
}

export default Admin;