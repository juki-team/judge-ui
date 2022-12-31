import { T, Tabs } from 'components';
import React from 'react';
import { AdminTab } from 'types';
import { ECSTaskDefinitionsManagement } from './ECSTaskDefinitionsManagement';
import { ECSTasksManagement } from './ECSTasksManagement';
import { JudgersSettings } from './JudgersSettings';
import { SQSManagement } from './SQSManagement';

export const JudgersManagement = () => {
  const tabs = [
    {
      key: AdminTab.ECS_TASKS_MANAGEMENT,
      header: <T className="tt-ce">ecs tasks</T>,
      body: <ECSTasksManagement />,
    },
    {
      key: AdminTab.ECS_DEFINITIONS_TASK_MANAGEMENT,
      header: <T className="tt-ce">ecs definitions task</T>,
      body: <ECSTaskDefinitionsManagement />,
    },
    { key: AdminTab.SQS_MANAGEMENT, header: <T className="tt-ce">sqs</T>, body: <SQSManagement /> },
    { key: AdminTab.JUDGERS_SETTINGS, header: <T className="tt-ce">settings</T>, body: <JudgersSettings /> },
  ];
  
  return (
    <div style={{ height: '100%' }}>
      <Tabs
        tabs={tabs}
        className="height-100-percent"
      />
    </div>
  );
};
