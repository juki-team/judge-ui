import { ContentLayout, T, Tabs, Users } from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { AdminTab } from 'types';

function Admin() {
  
  const { query, push } = useRouter();
  
  const index = {
    [AdminTab.USERS]: 0,
  };
  
  const tabs = [AdminTab.USERS];
  
  return (
    <div className="main-content">
      <ContentLayout>
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
      </ContentLayout>
    </div>
  );
}

export default Admin;