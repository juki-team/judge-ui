import { T, TabsInline } from 'components';
import { useJukiUI } from 'hooks';
import React from 'react';
import { AdminTab } from 'types';
import { EC2Management } from './EC2Management';
import { ECSTaskDefinitionsManagement } from './ECSTaskDefinitionsManagement';
import { ECSTasksManagement } from './ECSTasksManagement';
import { RunnersSettings } from './RunnersSettings';
import { SQSManagement } from './SQSManagement';

export const RunnersManagement = () => {
  const tabs = {
    [AdminTab.ECS_TASKS_MANAGEMENT]: {
      key: AdminTab.ECS_TASKS_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs tasks</T>,
      body: <ECSTasksManagement />,
    },
    [AdminTab.ECS_DEFINITIONS_TASK_MANAGEMENT]: {
      key: AdminTab.ECS_DEFINITIONS_TASK_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs definitions task</T>,
      body: <ECSTaskDefinitionsManagement />,
    },
    [AdminTab.SQS_MANAGEMENT]: {
      key: AdminTab.SQS_MANAGEMENT,
      header: <T className="tt-ce ws-np">sqs</T>,
      body: <SQSManagement />,
    },
    [AdminTab.RUNNERS_SETTINGS]: {
      key: AdminTab.RUNNERS_SETTINGS,
      header: <T className="tt-ce ws-np">settings</T>,
      body: <RunnersSettings />,
    },
    [AdminTab.EC2_MANAGEMENT]: {
      key: AdminTab.EC2_MANAGEMENT,
      header: <T className="tt-ce ws-np">ec2</T>,
      body: <EC2Management />,
    },
  };
  
  const { router: { searchParams, setSearchParam } } = useJukiUI();
  const selectedTabKey = searchParams.get('runnerTab') || AdminTab.ALL_USERS;
  const pushTab = tabKey => setSearchParam({ name: 'runnerTab', value: tabKey });
  
  return (
    <div style={{ height: '100%' }}>
      <TabsInline
        tabs={tabs}
        selectedTabKey={selectedTabKey}
        onChange={pushTab}
      />
      <div style={{ height: 'calc(100% - 40px)' }}>
        {tabs[selectedTabKey]?.body}
      </div>
    </div>
  );
};
