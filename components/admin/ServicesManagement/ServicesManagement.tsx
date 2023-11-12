import { T, TabsInline } from 'components';
import { renderReactNodeOrFunctionP1 } from 'helpers';
import { useJukiRouter } from 'hooks';
import React from 'react';
import { AdminTab, CompanyResponseDTO, TabsType } from 'types';
import { EC2Management } from './EC2Management';
import { ECSTaskDefinitionsManagement } from './ECSTaskDefinitionsManagement';
import { ECSTasksManagement } from './ECSTasksManagement';
import { FilesManagement } from './FilesManagement';
import { RunnersSettings } from './RunnersSettings';
import { SQSManagement } from './SQSManagement';

export const ServicesManagement = ({ company }: { company: CompanyResponseDTO }) => {
  const tabs: TabsType<AdminTab> = {
    [AdminTab.ECS_TASKS_MANAGEMENT]: {
      key: AdminTab.ECS_TASKS_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs tasks</T>,
      body: <ECSTasksManagement company={company} />,
    },
    [AdminTab.ECS_DEFINITIONS_TASK_MANAGEMENT]: {
      key: AdminTab.ECS_DEFINITIONS_TASK_MANAGEMENT,
      header: <T className="tt-ce ws-np">ecs definitions task</T>,
      body: <ECSTaskDefinitionsManagement company={company} />,
    },
    [AdminTab.SQS_MANAGEMENT]: {
      key: AdminTab.SQS_MANAGEMENT,
      header: <T className="tt-ce ws-np">sqs</T>,
      body: <SQSManagement />,
    },
    [AdminTab.RUNNERS_SETTINGS]: {
      key: AdminTab.RUNNERS_SETTINGS,
      header: <T className="tt-ce ws-np">settings</T>,
      body: <RunnersSettings company={company} />,
    },
    [AdminTab.EC2_MANAGEMENT]: {
      key: AdminTab.EC2_MANAGEMENT,
      header: <T className="tt-ce ws-np">ec2</T>,
      body: <EC2Management />,
    },
    [AdminTab.FILES_MANAGEMENT]: {
      key: AdminTab.FILES_MANAGEMENT,
      header: <T className="tt-ce ws-np">files</T>,
      body: <FilesManagement />,
    },
  };
  
  const { searchParams, setSearchParams } = useJukiRouter();
  const selectedTabKey = searchParams.get('servicesTab') as AdminTab || AdminTab.ECS_TASKS_MANAGEMENT;
  const pushTab = (tabKey: AdminTab) => setSearchParams({ name: 'servicesTab', value: tabKey });
  
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
