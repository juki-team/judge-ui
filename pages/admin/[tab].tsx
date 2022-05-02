import { T, Tabs, TwoContentLayout, Users } from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { AdminTab } from 'types';
import { can } from '../../helpers';
import { useUserState } from '../../store';
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
        ]}
        onChange={tabKey => push(ROUTES.ADMIN.PAGE(tabKey as AdminTab))}
      />
    </TwoContentLayout>
  );
}

export default Admin;