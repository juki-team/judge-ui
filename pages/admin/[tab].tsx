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
  
  const index = {
    [AdminTab.USERS]: 0,
  };
  
  const tabs = [AdminTab.USERS];
  
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
        selectedTabIndex={index[query.tab as AdminTab]}
        tabHeaders={[
          { children: <T className="text-capitalize">users</T> },
        ]}
        onChange={index => push(ROUTES.ADMIN.PAGE(tabs[index]))}
      >
        <Users />
        <div />
      </Tabs>
    </TwoContentLayout>
  );
}

export default Admin;