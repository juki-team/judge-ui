import {
  AllSubmissions,
  ECSTaskDefinitionsManagement,
  FilesManagement,
  SQSManagement,
  T,
  Tabs,
  TwoContentLayout,
  Users,
  UsersLogged,
} from 'components';
import { ROUTES } from 'config/constants';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { AdminTab } from 'types';
import { ECSTasksManagement } from '../../components/admin/ECSTasksManagement';
import { SettingsManagement } from '../../components/admin/SettingsManagement';
import Custom404 from '../404';

function Admin() {
  
  const { query, push } = useRouter();
  const {
    canViewUsersManagement,
    canViewSubmissionsManagement,
    canViewFilesManagement,
    canViewECSManagement,
    canViewSQSManagement,
  } = useUserState();
  
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
    tabs.push({ key: AdminTab.FILES_MANAGEMENT, header: <T className="tt-ce">files</T>, body: <FilesManagement /> });
  }
  if (canViewSQSManagement) {
    tabs.push({ key: AdminTab.SQS_MANAGEMENT, header: <T className="tt-ce">sqs</T>, body: <SQSManagement /> });
  }
  if (canViewECSManagement) {
    tabs.push({
      key: AdminTab.ECS_TASKS_MANAGEMENT,
      header: <T className="tt-ce">ecs task</T>,
      body: <ECSTasksManagement />,
    });
  }
  if (canViewECSManagement) {
    tabs.push({
      key: AdminTab.ECS_DEFINITIONS_TASK_MANAGEMENT,
      header: <T className="tt-ce">ecs definitions task</T>,
      body: <ECSTaskDefinitionsManagement />,
    });
  }
  if (canViewSQSManagement && canViewECSManagement && canViewFilesManagement) {
    tabs.push({ key: AdminTab.SETTINGS_MANAGEMENT, header: <T className="tt-ce">settings</T>, body: <SettingsManagement /> });
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