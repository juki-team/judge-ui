import { T, TabsInline } from 'components';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter } from 'hooks';
import React from 'react';
import { CompanyResponseDTO, ServicesManagementTab, TabsType } from 'types';
import { EC2Management } from './EC2Management';
import { ECSTaskDefinitionsManagement } from './ECSTaskDefinitionsManagement';
import { ECSTasksManagement } from './ECSTasksManagement';
import { FilesManagement } from './FilesManagement';
import { RunnersSettings } from './RunnersSettings';
import { SQSManagement } from './SQSManagement';
import { VirtualSubmissionsQueueManagement } from './VirtualSubmissionsQueueManagement';
import { VirtualUsersTable } from './VirtualUsersTable';

export const ServicesManagement = ({ company }: { company: CompanyResponseDTO }) => {
  const tabs: TabsType<ServicesManagementTab> = {
    [ServicesManagementTab.ECS_TASKS_MANAGEMENT]: {
      key: ServicesManagementTab.ECS_TASKS_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs tasks</T>,
      body: <ECSTasksManagement company={company} />,
    },
    [ServicesManagementTab.ECS_DEFINITIONS_TASK_MANAGEMENT]: {
      key: ServicesManagementTab.ECS_DEFINITIONS_TASK_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs definitions task</T>,
      body: <ECSTaskDefinitionsManagement company={company} />,
    },
    [ServicesManagementTab.SQS_MANAGEMENT]: {
      key: ServicesManagementTab.SQS_MANAGEMENT,
      header: <T className="tt-ce ws-np">sqs</T>,
      body: <SQSManagement />,
    },
    [ServicesManagementTab.RUNNERS_SETTINGS]: {
      key: ServicesManagementTab.RUNNERS_SETTINGS,
      header: <T className="tt-ce ws-np">settings</T>,
      body: <RunnersSettings company={company} />,
    },
    [ServicesManagementTab.EC2_MANAGEMENT]: {
      key: ServicesManagementTab.EC2_MANAGEMENT,
      header: <T className="tt-ce ws-np">ec2</T>,
      body: <EC2Management />,
    },
    [ServicesManagementTab.FILES_MANAGEMENT]: {
      key: ServicesManagementTab.FILES_MANAGEMENT,
      header: <T className="tt-ce ws-np">files</T>,
      body: <FilesManagement />,
    },
    [ServicesManagementTab.VIRTUAL_SUBMISSIONS_QUEUE]: {
      key: ServicesManagementTab.VIRTUAL_SUBMISSIONS_QUEUE,
      header: <T className="tt-ce ws-np">virtual submissions queue</T>,
      body: <VirtualSubmissionsQueueManagement />,
    },
    [ServicesManagementTab.VIRTUAL_USERS]: {
      key: ServicesManagementTab.VIRTUAL_USERS,
      header: <T className="tt-ce ws-np">virtual users</T>,
      body: <VirtualUsersTable />,
    },
  };
  
  const { searchParams, setSearchParams } = useJukiRouter();
  const selectedTabKey = searchParams.get('servicesTab') as ServicesManagementTab || ServicesManagementTab.ECS_TASKS_MANAGEMENT;
  const pushTab = (tabKey: ServicesManagementTab) => setSearchParams({ name: 'servicesTab', value: tabKey });
  
  return (
    <div style={{ height: '100%' }}>
      <TabsInline
        tabs={tabs}
        selectedTabKey={selectedTabKey}
        onChange={pushTab}
      />
      <div style={{ height: 'calc(100% - 40px)' }}>
        {renderReactNodeOrFunctionP1(tabs[selectedTabKey]?.body, { selectedTabKey })}
      </div>
    </div>
  );
};
